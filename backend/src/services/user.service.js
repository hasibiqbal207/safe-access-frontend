export const findUser = async (userId) => {
    const user = await UserModel.findById(userId);
    
    if(!user) {
        throw createHttpError.BadRequest("User not found");
    }
    return user;
}