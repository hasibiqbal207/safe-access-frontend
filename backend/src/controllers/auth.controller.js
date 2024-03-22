import { createUser } from "../services/auth.service";

export const register = async (req, res, next) => {
    try {
        const { name, email, picture, status, password } = req.body;
        const newUser = await createUser({ name, email, picture, status, password });

        const access_token = await generateToken(
            { userId: newUser._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );

        const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/v1/auth/refreshtoken',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Registration successful",
            access_token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture,
                status: newUser.status
            }
        });
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await signUser(email, password);

        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );

        const refresh_token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/v1/auth/refreshtoken',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Registration successful",
            access_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status
            }
        });
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('refreshtoken', { path: '/api/v1/auth/refreshtoken' });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * Refreshes the user's access token and returns the user information along with the new access token.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @return {Promise<void>} - a promise that resolves when the operation is complete
 */
export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshtoken;
        if (!refreshToken) throw createHttpError.Unauthorized("Please login");
        const check = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await findUser(check.userId)
        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            access_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status
            }
        });
    } catch (error) {
        next(error);
    }
}