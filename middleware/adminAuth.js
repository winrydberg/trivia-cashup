const checkAdminSignIn = (req, res, next) => {
  if (req.session.user) {
    next(); //If session exists, proceed to page
  } else {
    var err = new Error("Not logged in!");
    console.log(req.session.user);
    return res.redirect("/admin/login");
    //  next(err); //Error, trying to access unauthorized page!
  }
};

module.exports = checkAdminSignIn;
