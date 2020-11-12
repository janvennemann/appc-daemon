export default {
  GlobalPlugin: {
    current: (plugin, _args, { cache }) => {
      console.log('resolve current', plugin)
      return plugin.versions[0]
    }
  }
}
