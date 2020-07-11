const Setting = require('../models/Setting')

module.exports = async function getLayout() {
  try {
    const settings = await Setting.findOne({ name: 'layout' })
    if (!settings || (typeof settings === 'object' && Object.keys(settings).length === 0)) {
      const newSetting = new Setting
      const newSettings = await newSetting.save()
      return newSettings.layout
    } else {
      return settings.layout
    }
  } catch (err) {
    throw err
  }
}