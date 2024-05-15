    // format data object
    const requestObj = request.all()
    for (let key in request.all()) {
      console.log(requestObj[key])
    }
    return 1
    const userId = auth.user?.id
    const parameter = params.id //params= user id // string
    const user = await User.findOrFail(parameter) //status 404 error
//get first key property
    //case 1, admin editing either itself or a user
    // admin editing logic, user must be logged and isAdmin true
    if (auth.isAuthenticated && auth.user?.isAdmin) {
      // if admin userId NOT EQUAL to parameter(id to be edited), admin is trying to edit a different user
      if (parseInt(parameter) !== userId) {
        // logic to know what are the fields to be edited
        // general update
        if (notPassword) {
          // validate, email, fullName, isAdmin

        }
        // password redefinition
        else {
          const payload = await request.validateUsing(PutPasswordValidator) //error 400
        }
      }

      // admin wants to edit itself
      else if (parseInt(parameter) === userId) {
        if (notPassword) {
          const payload = await request.validateUsing(PutProfileValidator)

          // await user.merge(Object.assign(payload, updatedAt)).save()
        }
      }

      //   // else, admin editing itself
      //   else {
      //     if (notPassword) {
      //       const payload = await request.validateUsing(PutProfileValidator) // error 400
      //       await user.merge(Object.assign(payload, updatedAt)).save()
      //     } else {
      //       const payload = await request.validateUsing(PutPasswordValidator) //error 400
      //       await user.merge(Object.assign(payload, updatedAt)).save()
      //     }
      //   }
      // }
      // // //guest edit logic
      // // else if (auth.isAuthenticated && !auth.user?.isAdmin && parseInt(parameter) === userId) {
      // //   //general update
      // //   if (notPassword) {
      // //     const payload = await request.validateUsing(PutGuestValidator) //error 400
      // //     await user.merge(Object.assign(payload, updatedAt)).save()
      // //   } //password redefinition
      // //   else {
      // //     const payload = await request.validateUsing(PutPasswordValidator) //error 400
      // //     await user.merge(Object.assign(payload, updatedAt)).save()
      // //   }
      // // }
