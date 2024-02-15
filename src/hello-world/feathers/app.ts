import {feathers} from '@feathersjs/feathers'
import {koa, rest, bodyParser, errorHandler, serveStatic} from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

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

// create KoaJS and Feathers compatiblility
const app = koa<ServiceTypes>(feathers())

// current folder for static file hosting
app.use(serveStatic('.'))

// error handle
app.use(errorHandler())

// Parse JSON request bodies
app.use(bodyParser())



// Register Rest service handler
app.configure(rest())

// configure Socket.io real-time APIs
app.configure(socketio())


// register message service 
app.use('messages', new MessageService())

// add new real-time connections to 'everybody' channel
app.on('connection', (connection) => app.channel('everybody').join(connection))
// publish all events to 'everybody' channel
app.publish((_data) => app.channel('everybody'))

app.listen(3030)
    . then(() => console.log('Feathers server listening on localhost:3030'))

app.service('messages').create({
    text: 'Hello world from the server'
})

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