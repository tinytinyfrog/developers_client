import globalConfig from '../global'

export default ({ req }, inject) => {
  inject('global', globalConfig)
}
