const { user } = require("../../../models");
require("dotenv").config();
// const { sign, verify } = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("./tokenFunctions");

module.exports = (req, res) => {
  // 유효성 검사
  // const regexForEmail =
  //   /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  // const regexForPw = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/;

  // const isValidEmail = email.match(regexForEmail);
  // const isValidPw = email.match(regexForPw);
  // if (!isValidEmail) res.status(404).send({ message: "Invalid user" });
  // if (!isValidPw) res.status(401).send({ message: "Invalid password" });
  const { email, password } = req.body;

  user
    .findOne({
      where: { email: email, password: password },
    })
    .then((data) => {
      //console.log("login server 컨트롤러", data);
      if (!data) {
        return res.status(404).send({ message: "Invalid user" });
      } else {
        // console.log("login 파인드원 데이터 밸류", data.dataValues);
        const userPayload = {
          nickname: data.dataValues.nickname,
          email: data.dataValues.email,
        };
        // console.log(userPayload);
        //console.log("login user payload ", userPayload);
        // delete userPayload.password;
        // console.log("login findOne password delete", userPayload)
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);
        sendRefreshToken(res, refreshToken);
        sendAccessToken(res, accessToken);
      }
    })
    .catch((err) => console.log(err));
};
