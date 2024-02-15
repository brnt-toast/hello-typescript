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

// service registering
type ServiceTypes = {
    messages: MessageService
}

const app = feathers<ServiceTypes>()

// register message service 
app.use('messages', new MessageService())

// log every time a new message has been created
app.service('messages').on('created', (message: Message) => {
    console.log('A new message has been created', message)
})

// create messages then log all existing messages
const main = async () => {
    // create new message 
    await app.service('messages').create({
        text: "Hello Feathers"
    })

    //another message
    await app.service('messages').create({
        text: 'Hello again'
    })

    // find all messages
    const messages = await app.service('messages').find()

    console.log('All messages', messages)
}

main()