import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../modals/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const genrateAcessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user)
    const accessToken = await user.genrateAcessToken();
    const refreshtoken = await user.genrateRefreshToken();
   
    user.refreshtoken = refreshtoken;
    user.save({ validateBeforSave: false });
    return { accessToken, refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while genrating refresh and access token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All filed are Required");
  }
  const existeduser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (!existeduser) {
    throw new ApiError(409, "user already Exist");
  }
  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went happen during creating user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created succusfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username and Password required!");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }
  const IsPasswordvalid = await user.isPasswordCorrect(password);
  if (!IsPasswordvalid) {
    throw new ApiError(401, "invalid user credentials!");
  }
  const { accessToken, refreshtoken } = await genrateAcessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshtoken,
      },"user LoggedIN successfully"),
    );
});
const logoutUser=asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,{
  $set:{
    refreshtoken:undefined
  }
},
{
  new:true
}
)
const options = {
  httpOnly: true,
  secure: true,
};
return res.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken" , options)
.json(new ApiResponse(200,"user loggedout!"))

  
})
export { registerUser,loginUser,logoutUser };
