import {feathers} from '@feathersjs/feathers'

// message data
interface Message {
    id?: number
    text: string
}

// service to create new and return all existing messages
class MessageService {
    messages: Message[] = []

    async find() {
        // return all messages

        return this.messages
    }

    async create(data: Pick<Message, 'text'>){

        const message: Message = {
            id: this.messages.length,
            text: data.text
        }

        this.messages.push(message)

        return message
    }
}