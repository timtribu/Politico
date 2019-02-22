/* eslint-disable quote-props */
import pool from '../migrate';
import * as validation from '../helpers/schema';

class interestController {
  static async createInterest(req, res) {
    const { office, party } = req.body;
    const getUser = 'Select * from users where id= $1 AND registeras =$2';
    const checkPolitician = await pool.query(getUser, [req.user.id, 'politician']);
    if (!checkPolitician.rows[0]) {
      return res.status(404).json({
        'status': 404,
        'error': 'User is not a politician',
      });
    }
    validation.check(req.body, validation.createInterestSchema, res);
    const sendInterest = `INSERT INTO interests (office, party, interest)
    VALUES($1, $2 ,$3 )`;
    const selectInterest = 'Select * from interests';
    const values = [office, party, req.user.id];
    try {
      /**
          * Add the interest to  the database
          * create a unique Id
          * @return {object} - The interest object
            */
      await pool.query(sendInterest, values);

      const AllInterests = await pool.query(selectInterest);

      return res.status(201).json({
        'status': 201,
        'data': AllInterests.rows[AllInterests.rowCount - 1],
      });
    } catch (err) {
      return res.status(501).json({
        'status': 501,
        'error': err.toString(),
      });
    }
  }

  static async editInterest(req, res) {

    const id = Number(req.params.id);
    // eslint-disable-next-line prefer-destructuring
    validation.check(id, validation.id, res);
    const getUserInterests = 'Select * from interests where interest=$1 and id =$2';
    const { rows } = await pool.query(getUserInterests, [req.user.id, id]);
    if (!rows[0]) {
      return res.status(401).json({
        'status': 401,
        'error ': 'Interest not found',
      });
    }
    const {
      office, party,
    } = req.body;
    validation.check(req.body, validation.editInterestSchema, res);
    const updateInterest = `Update interests
        SET office = $1 , party =$2 where id = $3 returning *`;
    const values = [
      office || rows[0].office,
      party || rows[0].party,
      id];
    try {
      const updatedInterest = await pool.query(updateInterest, values);
      return res.status(201).json({
        'status': 201,
        'data': updatedInterest.rows[0],
      });
    } catch (err) {
      return res.status(501).json({
        'status': 501,
        'error': err.toString(),
      });
    }
  }

  static async getInterest(req, res) {
    try {
      const getallinterests = 'SELECT * from interests';
      const getuserinterests = 'SELECT * from interests where interest =$1';
      if (req.user.isAdmin === true) {
        const { rows } = await pool.query(getallinterests);
        return res.status(200).json({
          'status': 200,
          'data': rows,
        });
      }
      const { rows } = await pool.query(getuserinterests, [req.user.id]);
      if (!rows[0]) {
        return res.status(401).json({
          'status': 401,
          'error': 'Unauthorized',
        });
      }
      return res.status(200).json({
        'status': 200,
        'data': rows,
      });
    } catch (err) {
      return res.status(500).json({
        'status': 500,
        'error': err.toString(),
      });
    }
  }
  
  static async deleteInterest(req, res) {
    const id = Number(req.params.id);
    validation.check(id, validation.id, res);
    const getInterests = 'Select * from interests where id =$1 and interest=$2';
    const { rows } = await pool.query(getInterests, [id, req.user.id]);
    if (!rows[0]) {
      return res.status(404).json({
        'status': 404,
        'error': 'Interest not found',
      });
    }
    const deleting = 'Delete from interests where id=$1';
    try {
      await pool.query(deleting, [id]);
      return res.status(200).json({
        'status': 200,
        'data': {
          'message': 'interests deleted succesfully',
        },
      });
    } catch (err) {
      return res.status(501).json({
        'status': 501,
        'error': err.toString(),
      });
    }
  }
}
export default interestController;