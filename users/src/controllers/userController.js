import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// GET /user/:id
export const userProfile = asyncHandler(async (req, res) => {
   try {
    const { id } = req.params;
    const callerId = req.headers['x-user-id'] || '';
  const verifyUser = await User.findOne({ userId: id });
  if (!verifyUser) {
    return res.status(404).json({ message: "User not found", success: false });
  }
  if (callerId !== id) {
    return res.status(403).json({ message: 'You can only view your own profile.' });
  }
  res.status(200).json({
    message: `User ${verifyUser.firstName} ${verifyUser.lastName}`,
    success: true,
    data: verifyUser
  });
  }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }

});
 
// Utility: who is calling and what roles they have
function getCaller(req) {
  const callerId = req.headers['x-user-id'] || '';

  // split and remove empty entries
  const raw = req.headers['x-user-roles'] || '';
  const roles = raw
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);
  console.log('callerId is', callerId);
  console.log('roles is', roles);
  return { callerId, roles };
}

// Allowed elevated roles
const elevated = ['admin','editor','moderator'];


// function getRequestBody(req) {
//   // If Express has already populated req.body, just return it
//   if (req.body && Object.keys(req.body).length > 0) {
//     return req.body;
//   }
//   // Otherwise, manually buffer the incoming stream
//   return new Promise((resolve, reject) => {
//     let buf = '';
//     req.on('data', chunk => (buf += chunk));
//     req.on('end', () => {
//       if (!buf) return resolve({});          // no body → empty object
//       try {
//         return resolve(JSON.parse(buf));     // parse JSON
//       } catch (err) {
//         return reject(new Error('Invalid JSON'));
//       }
//     });
//     req.on('error', reject);
//   });
// }

// PUT /user/:id
export const updateUser = asyncHandler(async (req, res) => {
  try {
  const { id } = req.params;
  const { callerId, roles } = getCaller(req);
  console.log("callerId is", callerId)
   console.log("roles is", roles)
  // Only owner or admin
 // Only owner or an elevated role can update
  const elevated = ['admin','editor','moderator'];// Allowed elevated roles
  console.log("Allowed elevated roles", elevated)
  const isElevated = roles.some(r => elevated.includes(r));
  if (callerId !== id && !isElevated) {
    return res.status(403).json({ message: 'You can only update your own profile.' });
  }
  // Prevent role escalation
  if (req.body && req.body.roles) {
    return res.status(403).json({ message: 'Cannot update roles via this endpoint.' });
  }
  // const updateUser= await getRequestBody(req);
   const updateUser= req.body;
  console.log("new update:",updateUser)
  const updated = await User.findOneAndUpdate({ userId: id }, updateUser, { new: true });
  if (!updated) return res.status(404).json({ message: "User not found." });
  res.json({ message: "User updated successfully", user: updated });
 }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }

});

// DELETE /user/:id
export const deleteUser = asyncHandler(async (req, res) => {
  try {
  const { id } = req.params;
  const { callerId, roles } = getCaller(req);
  console.log("callerId is", callerId)
   console.log("roles is", roles)
  const elevated = ['admin','editor','moderator'];// Allowed elevated roles
  // Only owner or an elevated role can delete
  const isElevated = roles.some(r => elevated.includes(r));
  if (callerId !== id && !isElevated) {
    return res.status(403).json({ message: 'You can only delete your own account.' });
  }

  const deleted = await User.findOneAndDelete({ userId: id });
  if (!deleted) return res.status(404).json({ message: "User not found." });
  res.json({ message: "User deleted successfully" });
 } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
});

// GET /user?… (filter/paginate)
export const getAllusers = asyncHandler(async (req, res) =>{
     // phase 1 - filtering
    let queryObj = { ...req.query };
    ['page', 'sort', 'limit', 'fields']
        .forEach(el => delete queryObj[el]);  // phase 2 - advance filtering
    const strQuery = JSON.stringify(queryObj)
        .replace(/\b(gte|gt|lte|lt)\b/g,
            match =>`$${match}`);
    queryObj = JSON.parse(strQuery);
    console.log("Received Query Params:", req.query);
    console.log("Processed Query Object:",queryObj);
    
    const sort = req.query.sort ?req.query.sort.split(',').join(' ') : "";
    
    const selected = req.query.fields ? req.query.fields.split(',').join(' ') : "";
     const limit = req.query.limit || 100;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
//http://localhost:3000/users/users?page=1&sort=email

    try{
       const raw = req.headers['x-user-roles'] || '';
       const roles = raw
             .split(',')
              .map(r => r.trim())
             .filter(Boolean);
       console.log("roles is", roles)
  // Only elevated roles can see all user accounts
       const isElevated = roles.some(r => elevated.includes(r));
  if (!isElevated) {
    return res.status(403).json({ message: 'Admin/editor/moderator only.' });
  }
       const documents = await User.countDocuments(queryObj);
       
       if (documents === 0) {
          return res.status(200).json({ success: true, data: [], message: "No users found." });
            }
        if (skip >= documents && documents > 0) {
           return res.status(404).json({
              success: false,
              message: "Requested page exceeds available data.",
         });
      }
        const users = await User.find(queryObj)
       .skip(skip)
       .limit(limit)
       .select(selected)
       .sort(sort);
        console.log(users)
        return res.status(200).json({
           data: users,
           success: true, 
           page,
           limit,
           totalPages: Math.ceil(documents / limit),
           documents,
           message: "users list"
         });
    } catch (error) {
        return res.status(500).json({
           success: false, 
           message: error.message,
          });

    }
})
// POST /user/:id/upgrade
export const upgradeToAdmin = asyncHandler(async (req, res) => {
     try {
    const raw = req.headers['x-user-roles'] || '';
       const roles = raw
             .split(',')
              .map(r => r.trim())
             .filter(Boolean);
       console.log("roles is", roles)
  // Only elevated roles can promote others
  const elevated = ['admin','editor','moderator'];// Allowed elevated roles
  const isElevated = roles.some(r => elevated.includes(r));
  if (!isElevated) {
    return res.status(403).json({ message: 'Admin/editor/moderator only.' });
  }

  const { id } = req.params;
  const { confirmAdmin } = req.body;
  if (confirmAdmin !== 'YES') {
    return res.status(400).json({ message: 'Confirmation required.' });
  }

  const updated = await User.findOneAndUpdate(
    { userId: id },
    { $addToSet: { roles: 'admin' } },  // push 'admin' once
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json({ message: 'User promoted to Admin.', user: updated });
   }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
});

