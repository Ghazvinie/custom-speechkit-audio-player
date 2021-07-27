import { create } from '@storybook/theming/create'
import logo from '../assets/logo.svg'

export default create({
  base: 'light',

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'SpeechKit JS player demos',
  brandUrl: 'https://player.speechkit.io',
  brandImage: logo,
})
