const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const validator = require('../validators/validator')

//User creation..........
const createUser = async function (req, res) {
    try {
        const requestBody = req.body;
        const { title, name, phone, email, password, address } = req.body

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ ststus: false, message: `Empty body not accepted.` })
        }
        //title validation.......
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required'" })
        };
             

        if (!validator.isValidTitle(title)) {
            return res.status(400).send({ status: false, message: `Title should be among Mr, Mrs or Miss.` })
        }
       
        //name validation.......
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required." })
        }
       
        //phone validation.......
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Phone number is required" })
        }
      
        //email validation.......
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        }
    
        //password validation.......
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }
        
                
        //Phone must be unique.................
        const isphoneAlreadyUsed = await userModel.findOne({ phone: phone })
        if (isphoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: "Phone number already used." })
        }

        //Email must be unique.................
        const isEmailAlreadyUsed = await userModel.findOne({ email: email })
        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: "Email id is already used" })
        }
        
        //Phone number validation...........
        if (!/^[0-9]{10}$/.test(phone))
            return res.status(400).send({ status: false, message: "Invalid Phone number. Phone number must be of 10 digits." })
        
        //Valid email..................
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))
            return res.status(400).send({ status: false, message: "Invalid Email id." })

        if (!(password.trim().length >= 8 && password.trim().length <= 15)) {
            return res.status(400).send({ status: false, message: "Password criteria not fulfilled." })
        }

        const userData = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "Successfully saved User data", data: userData })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//User login..............
const loginUser = async function (req, res) {
    try {

        const requestBody = req.body;
        const {email,password} = requestBody;
        
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ ststus: false, message: `Empty body not accepted.` })
        };

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        };

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        };

        const User = await userModel.findOne({ email, password});
        if (!User) {
            return res.status(401).send({ status: false, msg: "Invalid email or password" });
        }
   
        const payload = {
            userId: User._id,
            iat: Math.floor(Date.now() / 1000), 
            exp: Math.floor(Date.now() / 1000) + (3600 * 24 * 30 )  
        };
        const token = jwt.sign(payload, "SecretKey");
        res.header("x-api-key", token);
        
        return res.status(200).send({ status: true, message: `User login successfull`, data: { token } })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {
    createUser,
    loginUser
}
