import {combineReducers} from 'redux'
import paymentGateway from './pgReducer'

const paymentGatewayReducer = combineReducers({
  paymentGateway,
})

export default paymentGatewayReducer
