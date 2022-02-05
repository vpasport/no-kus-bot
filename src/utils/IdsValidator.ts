import { MessageContext } from "vk-io";
import { config } from "../../config";

enum MessageTypes {
    forward = 'forward',
    default = 'default'
}

enum ResultTypes {
    replyToBot = 'replyToBot',
    replyToOtherBot = 'replyToOtherBot',
    noReply = 'noReply',
    selfReply = 'selfReply',
    normalReply = 'normalReply'
}

interface ValidateOption {
    replyToBot?: string | ((val?: any) => string | any),
    replyToOtherBot?: string | ((val?: any) => string | any)
    noReply?: string | ((val?: any) => string | any),
    selfReply?: string | ((val?: any) => string | any),
    normalReply?: string | ((val?: any) => string | any)
}


class IdsValidator {
    private type: MessageTypes = MessageTypes.default;
    private messageContext: MessageContext | null = null
    private options: ValidateOption = {}
    private selfId: number = config.vk.selfId

    static ResultTypes = ResultTypes

    constructor(validateType: 'forward' | 'default', context: MessageContext, options: ValidateOption) {
        this.type = MessageTypes[validateType]
        this.messageContext = context
        this.options = options
    }

    validate(): [ResultTypes, string | undefined | ((val?: any) => any)] {
        switch (this.type) {
            case MessageTypes.forward:
                return this.validateForward()
            default:
                return [ResultTypes.noReply, undefined]
        }
    }

    private validateForward(): [ResultTypes, string | undefined | ((val: string) => string)] {
        if (this.messageContext?.replyMessage)
            if (this.messageContext.replyMessage.senderId < 0)
                if (this.messageContext.replyMessage.senderId === this.selfId)
                    return [ResultTypes.replyToBot, this.options.replyToOtherBot]
                else
                    return [ResultTypes.replyToOtherBot, this.options.replyToOtherBot]
            else
                if (this.messageContext.senderId === this.messageContext.replyMessage.senderId)
                    return [ResultTypes.selfReply, this.options.selfReply]
                else
                    return [ResultTypes.normalReply, this.options.normalReply]

        return [ResultTypes.noReply, this.options.noReply]
    }
}

export {
    IdsValidator
}