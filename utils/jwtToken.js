const sendToken = (user, statusCode, res) => {
    let token;

    if (user.role === "provider") {
        token = user.providerGetJWTToken();
    } else {
        token = user.consumerGetJWTToken();
    }
    
    const options = {
        httpOnly: true,
        sameSite: 'None', // Note the correct capitalization and syntax
    };
    

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};

module.exports = sendToken;
