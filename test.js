const connection = await oracledb.getConnection({
    user: 'nadim',
    password: 'RrnL#ds0jZxN',
    connectionString: '172.31.10.38:1521/softdb.nblbd.com'
  });

        // const connection = await oracledb.getConnection({
      //   connectionString: '172.31.10.38:1521/softdb.nblbd.com',
      //   user: 'nadim',
      //   password: 'RrnL#ds0jZxN'
      // });

      // connection.callTimeout = 45*1000;

      // const resultOrc = await connection.execute(`SELECT FC.SMS_1
      //   FROM t24report.FBNK_CUSTOMER FC, t24report.FBNK_ACCOUNT FA
      //   WHERE FA.CUSTOMER = FC.RECID  AND FA.RECID = '1999005440092'`);

      // console.log('oracle: result');
      // console.log(resultOrc.rows);

      const testDB = async () => {
        const connection = await oracledb.getConnection({
            connectionString: '172.31.100.12:1521/t24testdb.nblbd.com',
            user: 'nadim',
            password: 'RptDb#210'
        });
        const resultOrc = await connection.execute(`SELECT FC.SMS_1 FROM t24report.FBNK_CUSTOMER FC, t24report.FBNK_ACCOUNT FA WHERE FA.CUSTOMER = FC.RECID  AND FA.RECID = '1999003431797'`);
        console.log('oracle: result');
        console.log(resultOrc.rows);
    }
    
    testDB();