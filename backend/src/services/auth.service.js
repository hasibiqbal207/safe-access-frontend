import validator from "validator";

//env variables
const {DEFAULT_PICTURE, DEFAULT_STATUS} = process.env;

export const createUser = async (userData) => {
    const { name, email, picture, status, password } = userData;

    // Create if fields are empty
    if (!name || !email || !password) {
        throw createHttpError.BadRequest("Please provide name, email and password");
    }

    // check name length
    if(!validator.isLength(name, { min: 2, max: 16 })) {
        throw createHttpError.BadRequest("Name must be between 2 and 16 characters");
    }

    // Check status Length
    if(status && status.length > 64) {
        throw createHttpError.BadRequest("Status must be less than 64 characters");
    }

    // Check email
    if(!validator.isEmail(email)) {
        throw createHttpError.BadRequest("Please provide a valid email");
    }

    // Check if user exists
    const checkDB = await UserModel.findOne({ email });
    if(checkDB) {
        throw createHttpError.Conflict(`${email} already exists`);
    }

    // Check password length
    if(!validator.isLength(password, { min: 6, max: 64 })) {
        throw createHttpError.BadRequest("Password must be between 6 and 64 characters");
    }

    //

    const user = await new UserModel({
        name,
        email,
        picture: picture || DEFAULT_PICTURE,
        status: status || DEFAULT_STATUS,
        password,
    }).save();

    return user;
}