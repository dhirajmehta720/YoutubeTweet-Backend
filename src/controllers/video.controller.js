import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { limit = 10, sortType = "desc" } = req.query;
  const page = req.query.p || 0;
  const videosPerPage = limit;

  const videos = await Video.find()
    .sort(sortType)
    .skip(page * videosPerPage)
    .limit(videosPerPage);

  return res.status(200).json({
    status: 200,
    videos,
    message: "Videos fetched successfully",
  });
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video

  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(401, "Fill the title and description");
  }
  const videoFilePath = req.files?.videoFile[0]?.path;
  const thumbnailPath = req.files?.thumbnail[0]?.path;

  if (!videoFilePath) {
    throw new ApiError(400, "video field is required");
  }
  if (!thumbnailPath) {
    throw new ApiError(400, "thumbnail field is required");
  }

  const videofile = await uploadOnCloudinary(videoFilePath);
  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!videofile || !thumbnail) {
    throw new ApiError(401, "Both video and thumbnail files are required");
  }

  console.log(videofile);

  const videoData = await Video.create({
    videoFile: videofile.url,
    thumbnail: thumbnail.url,
    title,
    duration: videofile.duration,
    description,
    owner: req.user?._id,
  });

  if (!videoData) {
    throw new ApiError(500, "Somethig went wrong while uploading the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, videoData, "Video uploades successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //check if the video is provided
  if (!videoId) {
    throw new ApiError(400, "please provide video id");
  }

  //find video by id
  const fetchdVideo = await Video.findByIdAndUpdate(
    { _id: videoId },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!fetchedVideo) {
    return res.status(404).json(new ApiResponse(404, {}, "Video not found"));
  }

  // Return the fetched video
  return res
    .status(200)
    .json(new ApiResponse(200, fetchedVideo, "Video Fetched Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  if (!videoId) {
    throw new ApiError(400, "Video ID is require");
  }
  if (!(title && description)) {
    throw new ApiError(400, "Title and description is require");
  }

  // const thumbnailLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.file.path;

  //upload cloudnary to cloud
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is require");
  }

  await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Video details updatd successfully", {}));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Please provide video ID");
  }

  const deletedVideo = await Video.deleteOne({ _id: videoId });

  if (deletedVideo.deletedCount === 0) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is missing");
  }

  // Fetch the current video document
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Toggle the isPublished status
  const newVideoStatus = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished, // Toggle the current status
      },
    },
    { new: true }
  );

  return res.status(200).json({
    status: 200,
    data: newVideoStatus,
    message: "Publish Status Updated Successfully",
  });
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
