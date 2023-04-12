import {imageCompressor} from './fileUtils'
export default class ResumableUpload {
  constructor({
    url,
    attachment = null,
    chunkSize = 256 * 1024,
    onChunkUploadSuccess = () => {},
    onChunkUploadError = () => {},
    uploadFinished = () => {},
    isChunkedUpload = false,
  }) {
    this.signedUrl = url
    this.chunkSize = chunkSize
    this.attachment = attachment
    this.onChunkUploadError = onChunkUploadError
    this.onChunkUploadSuccess = onChunkUploadSuccess
    this.uploadFinished = uploadFinished
    this.isChunkedUpload = isChunkedUpload
    this.offset = 0
    this.count = 0
    this.delay = 1000
    this.error = false
    this.controller = new AbortController()
    this.abort = false
  }
  later = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
  startUpload = async () => {
    if (!this.attachment || this.abort) {
      return
    }

    for (;;) {
      if (this.abort) {
        break
      }
      this.delay = this.count ? (this.delay || 1000) * 1.5 : 0
      this.delay = this.delay > 100000 ? 100000 : this.delay

      await this.later(this.delay)

      let chunk = this.attachment.slice(
        this.offset,
        this.offset + this.chunkSize
      )
      let chunksize = chunk.size
      if (!chunksize) {
        return
      }
      try {
        const headers = {
          'Content-Length': this.isChunkedUpload
            ? chunksize
            : this.attachment.size,
        }
        if (this.isChunkedUpload) {
          // offset - offset + chunksize -1 / attachmentsize     //chunksize min(256, remaining)
          headers['Content-Range'] = `bytes ${this.offset}-${
            this.offset + chunksize - 1
          }/${this.attachment.size}`
        }

        const res = await fetch(this.signedUrl, {
          headers,
          method: 'PUT',
          signal: this.controller.signal,
          body: this.isChunkedUpload ? chunk : this.attachment,
        })
        if (res.status === 200 || res.status === 201) {
          this.uploadFinished({response: res})
          this.count = 0
          break
        } else if (res.status === 308) {
          this.onChunkUploadSuccess({
            response: res,
            progress: (
              ((this.offset + chunksize) / this.attachment.size) *
              100
            ).toFixed(),
          })
          this.offset += chunksize
          this.count = 0
        } else {
          this.onChunkUploadError({response: res})
          this.abortUpload()
        }
      } catch (error) {
        if (this.count < 19) {
          this.count += 1
        } else {
          this.onChunkUploadError(error)
          break
        }
      }
    }
  }
  abortUpload = () => {
    this.controller.abort()
    this.abort = true
  }
}

export const uploadFileBySignedUrl = (signedUrl, attachment, options) => {
  if (options?.imageCompression) {
    let type = attachment.type.split('/')
    const allowedType = ['png', 'jpg', 'jpeg']
    const allowedMime = ['image']
    delete options.imageCompression
    if (allowedMime.includes(type[0]) && allowedType.includes(type[1])) {
      return imageCompressor(
        {
          image: attachment,
          compressedImageQuality: options.compressedImageQuality,
        },
        (compressedFile) => {
          return uploadFile(signedUrl, compressedFile, options)
        }
      )
    }
  }
  return uploadFile(signedUrl, attachment, options)
}

const uploadFile = (signedUrl, attachment, options) => {
  return new Promise((resolve, reject) => {
    const resumableUpload = new ResumableUpload({
      url: signedUrl,
      attachment,
      ...options,
      uploadFinished: () => {
        options?.uploadFinished()
        resolve()
      },
      onChunkUploadSuccess: () => {
        options?.onChunkUploadSuccess()
        resolve()
      },
      onChunkUploadError: async (args) => {
        options?.onChunkUploadError(args)
        reject('failed')
      },
    })
    resumableUpload.startUpload()
  })
}
