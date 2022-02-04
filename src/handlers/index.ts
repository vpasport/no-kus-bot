import { HearManager } from '@vk-io/hear'

import commands from './commands'
import textMessages from './texts'

const index = () => {
    const hearManager = new HearManager()

    commands(hearManager)
    textMessages(hearManager)

    return hearManager
}

export default index()