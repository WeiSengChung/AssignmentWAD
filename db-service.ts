import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';

const databaseName = 'addressdb.sqlite';

// Enable promise for SQLite
enablePromise(true);

export const getDBConnection = async() => {
    return openDatabase(
        {name: `${databaseName}`},
        openCallback,
        errorCallback,
    );
}


export const createTableAddresses = async( db: SQLiteDatabase ) => {
  try{//id, name, address, phone_no, date created
      const query = 'CREATE TABLE IF NOT EXISTS addresses(id integer PRIMARY KEY AUTOINCREMENT,name text NOT NULL,address text NOT NULL,phone_no text NOT NULL, date integer NOT NULL)';
      await db.executeSql(query);
    } catch (error) {
      console.error(error);
      throw Error('Failed to create table !!!');
    }
}

export const getAddresses = async( db: SQLiteDatabase ): Promise<any> => {
    try{
        const placeData : any = [];
        const query = `SELECT * FROM addresses ORDER BY id`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                placeData.push(item);
            })
          });
        return placeData;
      } catch (error) {
        console.error(error);
        throw Error('Failed to get addresses !!!');
      }
}


export const getAddressById = async( db: SQLiteDatabase, placeId: string ): Promise<any> => {
    try{
        const query = `SELECT * FROM addresses WHERE id=?`;
        const results = await db.executeSql(query,[placeId]);
        return results[0].rows.item(0)
      } catch (error) {
        console.error(error);
        throw Error('Failed to get address !!!');
      }
}


export const createAddress = async( 
        db: SQLiteDatabase,
        name: string,
        address : string,
        phone_no: string,
        date : number,
    ) => {
    try{
        const query = 'INSERT INTO addresses(name,address, phone_no, date) VALUES(?,?,?,?)';
        const parameters = [name,address,phone_no,date]
        await db.executeSql(query,parameters);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create address !!!');
      }
}



export const updateAddress = async( 
    db: SQLiteDatabase,
    name: string,
    city : string,
    phone_no: string,
    date : number,
    placeId: string
) => {
try{
    const query = 'UPDATE addresses SET name=?,address=?, phone_no=?, date=? WHERE id=?';
    const parameters = [name, city, phone_no, date, placeId]
    await db.executeSql(query,parameters);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update place !!!');
  }
}

export const deleteAddress = async( 
    db: SQLiteDatabase,
    placeId: string
    ) => {
    try{
        const query = 'DELETE FROM addresses WHERE id = ?' ;
        await db.executeSql(query,[placeId]);
    } catch (error) {
        console.error(error);
        throw Error('Failed to delete address !!!');
    }
}

const openCallback = () => {
    console.log('database open success');
}

const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}
