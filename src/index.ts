// import logger from "./config/logger"
// import { AppDataSource } from "./data-source"
// import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     // logger.info("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     // logger.info("Saved a new user with id: " + user.id)

//     // log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     // console.log("Loaded users: ", users)

//     // console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch((error : unknown) => logger.error(error))
