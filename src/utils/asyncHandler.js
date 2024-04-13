const asyncHandler = (requestHandler) => {
  return (req, res, error) => {
    return Promise.resolve(requestHandler(req, res, error)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

// its just a wrapper function, instead of writing everytime aysnc await we use this function to wrap the functions as a async await function

// try-catch wrapper
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
