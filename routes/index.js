import dbClient from '../utils/db'; // Assuming you're using a MongoDB client
import redisClient from '../utils/redis'; // Redis for session management

class FilesController {
  // Retrieve file by ID
  static async getShow(req, res) {
    const token = req.headers['x-token'];
    
    // Retrieve user by token
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileId = req.params.id;

    // Find file by ID and userId
    const file = await dbClient.db.collection('files').findOne({
      _id: dbClient.ObjectId(fileId),
      userId: dbClient.ObjectId(user),
    });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  // Retrieve all files for a specific parentId with pagination
  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    
    // Retrieve user by token
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parentId = req.query.parentId || '0';
    const page = parseInt(req.query.page, 10) || 0;
    const pageSize = 20;

    // Find files by parentId and userId, and paginate
    const files = await dbClient.db.collection('files')
      .find({
        parentId: parentId === '0' ? 0 : dbClient.ObjectId(parentId),
        userId: dbClient.ObjectId(user),
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    const result = files.map(file => ({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    }));

    return res.status(200).json(result);
  }
}

export default FilesController;

