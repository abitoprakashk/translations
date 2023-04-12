import {Button, Card, Icon} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import PageInfo from '../PageInfo/PageInfo'
import styles from './ReceiptPreview.module.css'

export default function ReceiptPreview({classes = {}, setIsOpen = null}) {
  const receipt = () => (
    <>
      <Card>
        <div>
          <header>
            <p>Codepen Sweet Shop</p>
            <p>13 December 2020</p>
          </header>
          <dl className="receipt__list">
            <div className="receipt__list-row">
              <dt className="receipt__item">CSS Candies</dt>
              <dd className="receipt__cost">£9.99</dd>
            </div>
            <div className="receipt__list-row">
              <dt className="receipt__item">HoTML Chocolate</dt>
              <dd className="receipt__cost">£4.19</dd>
            </div>
            <div className="receipt__list-row">
              <dt className="receipt__item">Jelly Scripts</dt>
              <dd className="receipt__cost">£3.99</dd>
            </div>
            <div className="receipt__list-row">
              <dt className="receipt__item">JamStack Crisps</dt>
              <dd className="receipt__cost">£5.99</dd>
            </div>
            <div className="receipt__list-row">
              <dt className="receipt__item">Sherbet Nodes</dt>
              <dd className="receipt__cost">£2.59</dd>
            </div>
            <div className="receipt__list-row receipt__list-row--total">
              <dt className="receipt__item">Total</dt>
              <dd className="receipt__cost">£26.75</dd>
            </div>
          </dl>
        </div>
      </Card>
    </>
  )
  return (
    <div className={classNames(styles.wrapper, classes.wrapper)}>
      <div className={styles.headerSection}>
        <div className={styles.headerLeftSide}>
          <Icon color="success" name={'checkCircle'} size="3xl" type="filled" />
          <div className={styles.paymentConfirmText}>Payment Confirmed</div>
          <div>
            <span className={styles.helperText}>Amar Akbar Anthony</span>
            <span>
              <Icon
                color="success"
                name={'ellipsisCircle'}
                size="xs"
                type="outlined"
              />
            </span>
            <span className={styles.helperText}>10 A</span>
            <span>
              <Icon
                color="success"
                name={'ellipsisCircle'}
                size="xs"
                type="outlined"
              />
            </span>
            <span className={styles.helperText}>$ 2000</span>
            <span>
              <Icon
                color="success"
                name={'ellipsisCircle'}
                size="xs"
                type="outlined"
              />
            </span>
            <span className={styles.helperText}>cash</span>
          </div>
          <div className={styles.helperText}>
            Recipt Generated: #1234566,#747665758,#84384893
          </div>
        </div>
        <div
          className={styles.headerRightSide}
          onClick={setIsOpen}
          role="button"
        >
          <Icon color="primary" name={'close'} size="xs" type="outlined" />
        </div>
      </div>
      <div className={styles.previewSection}>
        <div>{receipt()}</div>
        <PageInfo
          classes={{wrapper: styles.pageInfoWrapper}}
          //   {{...classes.pageInfoClasses}}
        />
      </div>
      <div className={styles.footerSection}>
        <Button> Download</Button>
        <Button> Print</Button>
      </div>
    </div>
  )
}
