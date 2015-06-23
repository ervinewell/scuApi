/**
 * 手动更新一些信息
 */

var libs = require('./libs.js');
var mysql = require('easymysql');
var conn = require('../mysql.js');
var cheerio = require('cheerio');
//var EventEmitter = require('events').EventEmitter;
//var event = new EventEmitter();
var config = require('../config.js');
var async = require('async');
var datas = require('./datas.js');
var common = require('./common.js');
var dbs = require('./dbs.js');
var pages = require('./pages.js');
var async = require('async');
var code = require('../code.js');
var request = require('request');
var updates={

};

/**
 * 更新学期信息
 * @param cb
 */
updates.term = function(cb){
    if(datas.status.versionStatus && datas.status.termStatus) {

        var o = {
            url: config.urls.teacherGet,
            studentId: datas.account.studentId,
            password: datas.account.password
        };

        libs.get(o, function (err, data) {
            if(err){
                cb(err);
                return;
            }
            var $ = cheerio.load(data.data);
            var data = $("select[name=lsxnxq] option");
            var currentTermId = $("select[name=lsxnxq]").val();
            var termId,current=0;
            var list = [];

            for(var key in data){
                if (data.hasOwnProperty(key)){
                    if ($(data[key]).val()) {
                        termId=$(data[key]).val().trim();
                        if(termId == currentTermId){
                            current = 1;
                        }else{
                            current = 0;
                        }

                        list.push({
                            "id": termId,
                            "name": $(data[key]).text().trim(),
                            "current":current
                        });
                    }
                }

            }
            var latestVersion=datas.version.termLatestVersion;
            dbs.updateVersion({fieldName:"term",field:"termLatestVersion",version:(datas.version.termLatestVersion+1)},function(e,r){
                if(e){
                    cb(e);
                    return;
                }
                var sql;
                var termSql = [];
                for (var i = 0; i < list.length; i++) {
                    termSql[i] = "(\"" + list[i].id+ "\",\"" +list[i].name + "\","+list[i].current+"," + (parseInt(latestVersion) + 1) + ")";
                }
                sql = "insert into scu_term (`termId`,`name`,`current`,`version`) VALUES " + termSql.join(',');
                //console.log(sql);
                conn.query(
                    {
                        sql: sql
                    }, function (err, rows) {
                        if (err) {
                            console.log(err);
                            cb(err);
                            return;
                        }
                        if (rows) {
                            //console.log(rows);
                            console.log('学期信息已更新到版本'+(latestVersion+1));
                            cb(null);
                            return;
                        }

                    }
                );



            });

        });

    }else{
        cb(code.loadNotFinished);
    }

};

//todo 更新校区信息

//todo 更新课程属性信息

/**
 * 更新课程类型信息
 * @param cb
 */
updates.type = function(cb){
    if(datas.status.versionStatus && datas.status.accountStatus) {
        var o = {
            url: config.urls.courseGet,
            studentId: datas.account.studentId,
            password: datas.account.password
        };
        libs.get(o, function (err, data) {
            if(err){
                cb(err);
                return;
            }
            var $ = cheerio.load(data.data);
            var data = $("select[name=kclbdm] option");
            var list = [];
            for(var key in data){
                if (data.hasOwnProperty(key)){
                    if ($(data[key]).val()) {
                        list.push({
                            "id": $(data[key]).val(),
                            "name": $(data[key]).text()
                        });
                    }
                }

            }
            var latestVersion=datas.version.typeLatestVersion;
            dbs.updateVersion({fieldName:"type",field:"typeLatestVersion",version:(datas.version.typeLatestVersion+1)},function(e,r){
                if(e){
                    cb(e);
                    return;
                }
                var sql;
                var typeSql = [];
                for (var i = 0; i < list.length; i++) {
                    typeSql[i] = "(" + list[i].id+ ",\"" +list[i].name + "\"," + (parseInt(latestVersion) + 1) + ")";
                }
                sql = "insert into scu_type (`typeId`,`name`,`version`) VALUES " + typeSql.join(',');
                conn.query(
                    {
                        sql: sql
                    }, function (err, rows) {
                        if (err) {
                            console.log(err);
                            cb(err);
                            return;
                        }
                        if (rows) {
                            //console.log(rows);
                            console.log('课程类别信息已更新到版本'+(latestVersion+1));
                            cb(null);
                            return;
                        }

                    }
                );



            });

        });
    }else{
        cb(code.loadNotFinished);
    }
};

/**
 * 更新学院信息
 * @param cb
 */
updates.college = function(cb){
    if(datas.status.versionStatus && datas.status.accountStatus) {
        var o = {
            url: config.urls.college,
            studentId: datas.account.studentId,
            password: datas.account.password
        };

        libs.get(o, function (err, data) {
            if(err){
                cb(err);
                return;
            }
            var $ = cheerio.load(data.data);
            var data = $("select[name=bjxsh] option");
            var list = [];
            for(var key in data){
                if (data.hasOwnProperty(key)){
                    if ($(data[key]).val()) {
                        list.push({
                            "id": $(data[key]).val(),
                            "name": $(data[key]).text()
                        });
                    }
                }

            }
            var latestVersion=datas.version.collegeLatestVersion;
            dbs.updateVersion({fieldName:"college",field:"collegeLatestVersion",version:(datas.version.collegeLatestVersion+1)},function(e,r){
                if(e){
                    cb(e);
                    return;
                }
                var sql;
                var collegeSql = [];
                for (var i = 0; i < list.length; i++) {
                    collegeSql[i] = "(" + list[i].id+ ",\"" +list[i].name + "\"," + (parseInt(latestVersion) + 1) + ")";
                }
                sql = "insert into scu_college (`collegeId`,`name`,`version`) VALUES " + collegeSql.join(',');
               // console.log(sql);
                conn.query(
                    {
                        sql: sql
                    }, function (err, rows) {
                        if (err) {
                            console.log(err);
                            cb(err);
                            return;
                        }
                        if (rows) {
                            //console.log(rows);
                            console.log('学院信息已更新到版本'+(latestVersion+1));
                            cb(null);
                            return;
                        }

                    }
                );



            });

        });
    }else{
        cb(code.loadNotFinished);
    }
};

/**
 * 更新教师信息
 * @param cb
 */
updates.teacher = function(cb){
    //更新老师信息
    if(datas.status.versionStatus && datas.status.accountStatus) {

            var oo = {
                //get请求教师列表
                url:config.urls.teacherGet,
                studentId:datas.account.studentId,
                password:datas.account.password
            };

            libs.get(oo,function(e,r){

                if(e){
                    cb(e);
                    console.log(e);
                    return;
                }
                libs.rePost({
                    url: config.urls.teacherPost,
                    form:{
                        pageSize:10
                    },
                    jar: r.j
                },function(ee,data) {
                    if (ee) {
                        cb(ee);
                        console.log(ee);
                        return;
                    }
                    var teacherCount = data.data.substring(data.data.lastIndexOf("共") + 1, data.data.indexOf("项", data.data.lastIndexOf("共")));

                    var teacherPageCount;
                    if((teacherCount % config.params.teacherListPageSize)==0){
                        teacherPageCount = parseInt(teacherCount / config.params.teacherListPageSize);
                    }else{
                        teacherPageCount = parseInt(teacherCount / config.params.teacherListPageSize) + 1;
                    }
                    var urls = [], url = {};
                    for (var i = 0; i < teacherPageCount; i++) {
                        url = {
                            url: config.urls.teacherPost,
                            form: {
                                pageSize: config.params.teacherListPageSize,
                                page: i + 1
                            },
                            j: r.j
                        };
                        urls.push(url);
                    }
                    console.log('已获取教师总数');
                    // console.log(urls);
                    var latestVersion=datas.version.teacherLatestVersion;
                    dbs.updateVersion({
                        fieldName:"teacher",
                        field: "teacherLatestVersion",
                        version: (datas.version.teacherLatestVersion + 1)
                    }, function (eeeeeee) {
                        if (eeeeeee) {
                            console.log(eeeeeee);
                            cb(eeeeeee);
                            return;
                        }
                    async.eachSeries(urls, function (url, cb) {
                        //console.log(url);
                        libs.rePost(url, function (eee, rrr) {
                            if (eee) {
                                console.log(eee);
                                cb(eee);
                                return;
                            }
                            pages.teacherList(rrr.data, function (eeee, rrrr) {
                                //console.log('test');
                                if (eeee) {
                                    console.log(eeee);
                                    cb(eeee);
                                    return;
                                }
                                var sql;
                                var teacherSql = [];
                                for (var i = 0; i < rrrr.data.length; i++) {
                                    teacherSql[i] = "(\"" + rrrr.data[i].id+ "\"," + rrrr.data[i].collegeId + ",\"" +rrrr.data[i].name + "\",\"" + rrrr.data[i].level+ "\"," + (parseInt(latestVersion) + 1) + ")";
                                }
                                sql = "insert into scu_teacher (`teacherId`,`collegeId`,`name`,`level`,`version`) VALUES " + teacherSql.join(',');
                                console.log(sql);
                                conn.query(
                                    {
                                        sql: sql
                                    }, function (eeeee) {
                                        if (eeeee) {
                                            cb(code.mysqlError);
                                            console.log(eeeee);
                                            return;
                                        }
                                        console.log('教师信息更新中...');
                                        cb(null);
                                    }
                                )
                            });
                        });
                    }, function (eeeeee) {
                        if (eeeeee) {
                            console.log(eeeeee);
                            cb(eeeeee);
                            return;
                        }
                            console.log('教师信息已更新到版本' + (datas.version.teacherLatestVersion + 1));
                    });
                    });
                });
        });
    }else{
        cb(code.loadNotFinished);
    }

};


/**
 * 从某一页的某一项中更新
 * @param options
 *
 * @param cb
 */
updates.course = function(options,cb){
    /**
     *
     * courseBasePage,courseBaseKey
     * courseDetailPage,courseDetailKey
     */
options.courseDetailPage = parseInt(options.courseDetailPage);
    if(datas.status.versionStatus && datas.status.accountStatus) {


        var oo = {
            //请求课程列表
            url: config.urls.coursePost,
            studentId: datas.account.studentId,
            password: datas.account.password
        };
        libs.post(oo, function (e, data) {
            if (e) {
                cb(e);
                console.log(e);
                return;
            }

            var latestVersion=options.version;
            dbs.updateVersion({
                fieldName:"course",
                field: "courseLatestVersion",
                version:(options.version + 1)
            }, function (eeeeeee) {
                if (eeeeeee) {
                    console.log(eeeeeee);
                    cb(eeeeeee);
                    return;
                }
                var urls = pages.courseBase(data.data, options.courseBasePage,data.j);
                //console.log(urls);
                async.eachSeries(urls, function (url, cb2) {
                    //  console.log('正在获取第' + url.form.page + "页课程base列表");
                    libs.rePost(url, function (eee, rrr) {
                        if (eee) {
                            console.log(eee);
                            cb2(eee);
                            return;
                        }
                        var courseList = pages.courseList(rrr.data, options.courseBaseKey);
                        options.courseBaseKey = -1;
                        async.eachSeries(courseList, function (courseBase, cb3) {
                            o.url = config.urls.courseDetailCount + "&kch=" + courseBase.courseId + "&pageSize=" + config.params.currentCoursePageSize;
                            ;
                            //console.log(o.url);
                            libs.rePost({
                                url: config.urls.courseDetailCount + "&kch=" + courseBase.courseId + "&pageSize=" + config.params.currentCoursePageSize,
                                jar: data.j
                            }, function (eeeeeee, rrrrrrr) {
                                if (eeeeeee) {
                                    console.log(eeeeeee);
                                    cb3(eeeeeee)
                                    return;
                                }
                                ;
                                var courseDetailUrls = pages.courseDetail(rrrrrrr.data, courseBase.courseId, options.courseDetailPage,data.j);
                                options.courseDetailPage = 0;
                                // console.log(courseDetailUrls);
                                //console.log(courseDetailUrls);return;
                                if (courseDetailUrls.length > 0) {

                                    async.eachSeries(courseDetailUrls, function (courseDetailPage, cb4) {

                                        libs.rePost(courseDetailPage, function (eeeeeeeeeeeee, rrrrrrrrrrrrr) {
                                            if (eeeeeeeeeeeee) {
                                                cb4(eeeeeeeeeeeee);
                                                console.log(eeeeeeeeeeeee);
                                                return;
                                            }
                                            //console.log('获取新的' + courseDetailPage.url + '的所有课程');
                                            var course = pages.courseInfo(rrrrrrrrrrrrr.data, options.courseDetailKey);

                                            options.courseDetailKey = -1;
                                            var sql;
                                            var courseSql = [];
                                            for (var i = 0; i < course.length; i++) {
                                                courseSql[i] = "('" + course[i].courseId + "'," + course[i].collegeId + ",'" + common.mysqlEscape(course[i].name) + "','" + course[i].orderId + "'," + course[i].credit + ",'" + courseBase.type + "','" + course[i].examType + "','" + course[i].teacher + "','" + course[i].weekHasLesson + "','" + course[i].lesson + "'," + course[i].week + ",'" + course[i].campusId + "','" + course[i].building + "','" + course[i].classroom + "'," + course[i].max + "," + course[i].count + ",'" + course[i].limit + "','"+course[i].termId+"'," + (parseInt(latestVersion) + 1) + ")";
                                            }
                                            sql = "insert into scu_course (`courseId`,`collegeId`,`name`,`orderId`,`credit`,`type`,`examType`,`teacher`,`weekHasLesson`,`lesson`,`week`,`campusId`,`building`,`classroom`,`max`,`count`,`limit`,`termId`,`version`) VALUES " + courseSql.join(',');
                                            console.log(sql);
                                            conn.query(
                                                {
                                                    sql: sql
                                                }, function (eeeee) {
                                                    if (eeeee) {
                                                        cb4(code.mysqlError);
                                                        console.log(eeeee);
                                                        return;
                                                    }
                                                    console.log({
                                                        courseDetailPage: courseDetailPage.page,
                                                        courseDetailKey: -1,
                                                        courseBasePage: url.form.page,
                                                        courseBaseKey: courseBase.key,
                                                        version:latestVersion
                                                    });
                                                    cb4(null);
                                                }
                                            )

                                        });
                                    }, function (eeeeeeeeeeee) {
                                        if (eeeeeeeeeeee) {
                                            console.log(eeeeeeeeeeee);
                                            cb3(eeeeeeeeeeee);
                                            return;
                                        }
                                        // console.log('写完课程' + courseBase.courseId + '了');
                                        cb3(null);
                                    })
                                } else {

                                    //todo 去课程课表信息分别查询每一学期的课序号
                                    var sql;
                                    var courseSql = "('" + courseBase.courseId + "'," + courseBase.collegeId + ",'" + common.mysqlEscape(courseBase.name) + "',''," + 0 + ",'" + courseBase.type + "','','','','',0,'','','',0,0,''," + (parseInt(latestVersion) + 1) + ")";
                                    sql = "insert into scu_course (`courseId`,`collegeId`,`name`,`orderId`,`credit`,`type`,`examType`,`teacher`,`weekHasLesson`,`lesson`,`week`,`campusId`,`building`,`classroom`,`max`,`count`,`limit`,`version`) VALUES " + courseSql;
                                    //console.log(sql);
                                    conn.query(
                                        {
                                            sql: sql
                                        }, function (eeeee) {
                                            if (eeeee) {
                                                cb3(code.mysqlError);
                                                console.log(eeeee);
                                                return;
                                            }
                                            console.log({
                                                courseDetailPage: 0,
                                                courseDetailKey: -1,
                                                courseBasePage: url.form.page,
                                                courseBaseKey:courseBase.key,
                                                version:latestVersion
                                            });
                                            cb3(null);
                                        }
                                    )
                                }

                            });

                        }, function (eeeeeeeeeee) {
                            if (eeeeeeeeeee) {
                                cb2(eeeeeeeeeee);
                                console.log(eeeeeeeeeee);
                                return;
                            }
                            // console.log('更新完base的第' + url.form.page + '课程了...');
                            cb2(null)

                        });

                    });
                }, function (err) {
                    if (err) {
                        cb(err);
                        console.log(err);
                        return;
                    }
                    console.log('所有课程信息更新完毕');
                    cb(null)
                });
            });
        });

    }else{
        console.log('有信息没有载入');


    }

};

/**
 * 组合参数去调用更新课程信息列表
 * @param o
 * {
      version:98,
      courseBasePage: 1,
      courseBaseKey:  -1,
      courseDetailPage: 0,
      courseDetailKey: -1
      }
 * @param cb
 */
updates.updateCourse = function(o,cb){
    if(datas.status.versionStatus && datas.status.accountStatus) {
        var options={
          version: o.version||datas.version.courseLatestVersion,
            courseBasePage: o.courseBasePage || 1,
            courseBaseKey: o.courseBaseKey || -1,
            courseDetailPage: ''+o.courseDetailPage || '0',
            courseDetailKey: o.courseDetailKey||-1
        };
        updates.course(options, function (e, r) {
            if (e) {
                console.log(e);
                return;
                cb(e);
            }
            cb(null);
        });
    }else{
        console.log('load没有载入完成');
    }
};

//todo 根据参数来更新成绩，新增一个版本

updates.score = function(o,cb) {

libs.get({
    studentId:o.studentId,
    password:o.password,
    url: config.urls.scoreAll
},function(e,r){
    if(e){
        // console.log('3')
        cb(e);

        //密码错误
        if(e.code == 2001){

            conn.query({
                    sql: "update `scu_user` set error=1 where id=" + o.studentId
                }, function (eeee, rrrr) {
                    if (eeee) {
                        console.log(eeee);
                        return;
                    }
                    console.log(o.studentId+'的帐号密码有问题');
                    return;
                }
            );
        }
        //console.log(e);
        return;
    }
    var scoreList = pages.scoreList(r.data);
// console.log(scoreList)
   if(Object.keys(scoreList).length==0){
       conn.query(
           {
               sql:"update `scu_user` set `scoreVersion`=scoreVersion+1,scoreCount=0,scoreUpdateAt="+common.time()+" where id="+ o.studentId
           },function(eeeeee){
               if(eeeeee){
                   cb(code.mysqlError);
                   console.log(eeeeee);
                   return;
               }else{
                   cb(null);
                   return;

               }
           }
       );
       return;
   }

    libs.reGet({
        url:config.urls.scorePass,
        j: r.j
    },function(ee,rr){
    if(ee){
        cb(ee);
        console.log(ee);
        return;
    }
     //   console.log('test1');
    var scorePass = pages.scorePass(rr.data);
        libs.reGet({
            url:config.urls.scoreFail,
            j: r.j
        },function(eee,rrr) {
            if (eee) {
                cb(eee);
                console.log(eee);
                return;
            }
            libs.rePost(
                {
                    url:'http://202.115.47.141/logout.do',
                    form:{
                        'loginType':"platformLogin"
                    },
                    j: r.j
                },function(eeee,rrrr){

            var scoreFail = pages.scoreFail(rrr.data);
            for (var i in scoreList){
                for(var k=0;k<scoreList[i].length;k++){
                    if(scoreList[i][k].score>=60){
                        if(scorePass[i][scoreList[i][k].courseId]){

                            scoreList[i][k].orderId=scorePass[i][scoreList[i][k].courseId].orderId;
                            scoreList[i][k].englishName=scorePass[i][scoreList[i][k].courseId].englishName;
                            scoreList[i][k].credit=scorePass[i][scoreList[i][k].courseId].credit;
                            scoreList[i][k].reason="";
                        }else{
                            var detail = pages.scorePassDetail(rr.data,scoreList[i][k].courseId);

                            scoreList[i][k].orderId=detail.orderId;
                            scoreList[i][k].englishName=detail.englishName;
                            scoreList[i][k].credit=detail.credit;
                            scoreList[i][k].reason="";
                        }


                    }else{
                       for(var m=0;m<scoreFail.length;m++){
                           if(scoreFail[m].courseId == scoreList[i][k].courseId && scoreFail[m].date == scoreList[i][k].date){
                               scoreList[i][k].orderId=scoreFail[m].orderId;
                               scoreList[i][k].englishName=scoreFail[m].englishName;
                               scoreList[i][k].credit=scoreFail[m].credit;
                               scoreList[i][k].reason=scoreFail[m].reason;
                           }
                       }
                    }
                }
            }
            var scores=[];
            for(var i in scoreList){
                for(var k=0;k<scoreList[i].length;k++){
                   // console.log(scoreList[i][k]);
                    scores.push(scoreList[i][k]);
                }
            }
                    conn.query(
                        {
                            sql:"select scoreVersion from scu_user where id="+ o.studentId
                        },function(eee1,rrr1){
                            if(eee1){
                                console.log(eee1);
                                cb(code.mysqlError);
                                return;
                            }


                            if(rrr1.length==0){

                                rrr1=[];
                                rrr1[0]={
                                    scoreVersion:0
                                };
                            }
            var sql;
            var scoreSql = [];
            for (var i = 0; i < scores.length; i++) {
                scoreSql[i] = "('"+scores[i].courseId+"','"+(scores[i].name)+"','"+common.mysqlEscape(scores[i].englishName)+"','"+scores[i].orderId+"',"+scores[i].credit+","+scores[i].score+",'"+scores[i].propertyId+"',"+o.studentId+",'"+scores[i].reason+"','"+scores[i].termId+"'," + (parseInt(rrr1[0].scoreVersion) + 1) + ")";
            }




            sql = "insert into scu_score (`courseId`,`name`,`englishName`,`orderId`,`credit`,`score`,`propertyId`,`studentId`,`reason`,`termId`,`version`) VALUES " + scoreSql.join(',');
            // console.log(sql);
            conn.query(
                {
                    sql: sql
                }, function (eeeee) {
                    if (eeeee) {
                        cb(code.mysqlError);
                        console.log(eeeee);
                        return;
                    }
                  conn.query(
                      {
                          sql:"update `scu_user` set `scoreVersion`=scoreVersion+1,scoreCount="+scores.length+",scoreUpdateAt="+common.time()+" where id="+ o.studentId
                      },function(eeeeee,rrrrrr){
                          if(eeeeee){
                              cb(code.mysqlError);
                              console.log(eeeeee);
                              return;
                          }else{
                                  cb(null);
                                  return;

                          }
                      }
                  )

                });
                        }
                    )
                });

        });

    });
});
};

//todo 根据参数来更新课表，新增一个版本
updates.curriculum = function(o,cb){

    libs.get({
        studentId:o.studentId,
        password:""+o.password+"",
        url: config.urls.major
    },function(e,r){
        if(e){

            if(e.code == 2001){


                conn.query({
                        sql: "update `scu_user` set error=1 where id=" + o.studentId
                    }, function (eeee, rrrr) {
                        if (eeee) {
                            cb(code.mysqlError);
                            console.log(eeee);
                            return;
                        }
                        cb(code.passwordError);
                        console.log(o.studentId+'的帐号密码有问题');
                        return;
                    }
                );
            }
            cb(e);

            console.log(e);
            return;
        }       // console.log(b);
        //console.log(r);

        libs.rePost(
            {
                url:'http://202.115.47.141/logout.do',
                form:{
                    'loginType':"platformLogin"
                },
                j: r.j
            },function(eeee,rrrr) {
                //console.log('1');

                if(eeee){
                    cb(code.requestError);
                    console.log(eeee);
                    return;
                }
                //console.log(o);
                
                var list = pages.curriculum(r.data);
                //console.log('2');
                //console.log(list);

                if(list.length>0) {

                    conn.query({
                        sql:"select majorVersion from scu_user where id="+ o.studentId

                    },function(errr,roww) {

                        if (errr) {
                            cb(code.mysqlError);
                            console.log(errr);
                            return;
                        }


                        if(roww.length==0){

                            roww=[];
                            roww[0]={
                                majorVersion:0
                            };
                        }
                        var sql;
                        var listSql = [];
                        for (var i = 0; i < list.length; i++) {
                            listSql[i] = "('" + list[i].courseId + "','" + (list[i].name) + "','" + list[i].orderId + "'," + list[i].credit + ",'" + list[i].propertyId + "'," + o.studentId + ",'" + datas.currentTerm.termId + "','" + list[i].status + "','" + list[i].weekHasLesson + "','" + list[i].teacher + "'," + list[i].week + ",'" + list[i].lesson + "','" + list[i].campusId + "','" + list[i].building + "','" + list[i].classroom + "'," + (parseInt(roww[0].majorVersion) + 1) + ")";
                        }
                        sql = "insert into scu_major (`courseId`,`name`,`orderId`,`credit`,`propertyId`,`studentId`,`termId`,`status`,`weekHasLesson`,`teacherName`,`week`,`lesson`,`campusId`,`building`,`classroom`,`version`) VALUES " + listSql.join(',');
                        //console.log(sql);
                        conn.query(
                            {
                                sql: sql
                            }, function (eeeee) {
                                if (eeeee) {
                                    cb(code.mysqlError);
                                    console.log(eeeee);
                                    return;
                                }
                                conn.query(
                                    {
                                        sql: "update `scu_user` set `majorVersion`=majorVersion+1,majorCount=" + list.length + ",majorUpdateAt=" + common.time() + " where id=" + o.studentId
                                    }, function (eeeeee, rrrrrr) {
                                        if (eeeeee) {
                                            cb(code.mysqlError);
                                            console.log(eeeeee);
                                            return;
                                        } else {
                                            cb(null);
                                            console.log(o.studentId + '的课表成功更新');
                                            return;

                                        }
                                    }
                                )

                            });
                    });
                }else{



                    conn.query(
                        {
                            sql: "update `scu_user` set `majorVersion`=majorVersion+1,majorCount=" + list.length + ",majorUpdateAt=" + common.time() + " where id=" + o.studentId
                        }, function (eeeeee, rrrrrr) {
                            if (eeeeee) {
                                cb(code.mysqlError);
                                console.log(eeeeee);
                                return;
                            } else {
                                cb(null);
                                console.log('成功更新');
                                return;

                            }
                        }
                    );

                }

            });

    });
    

};


//todo 根据参数更新考表，新增一个版本
updates.exam = function(o,cb){
    
    //console.log(o);
    libs.get({
        studentId:o.studentId,
        password:""+o.password+"",
        url: config.urls.exam
    },function(e,r){
        if(e){
            //console.log('11');
            //console.log(e);

            if(e.code == 2001){
                conn.query({
                        sql: "update `scu_user` set error=1 where id=" + o.studentId
                    }, function (eeee, rrrr) {
                        if (eeee) {
                            cb(code.mysqlError);
                            console.log(eeee);
                            return;
                        }
                        cb(code.passwordError);
                        console.log(o.studentId+'的帐号密码有问题');
                        return;
                    }
                );
                return;
            }

            cb(e);

            return;
        }       // console.log(b);
        //console.log(r);

        libs.rePost(
            {
                url:'http://202.115.47.141/logout.do',
                form:{
                    'loginType':"platformLogin"
                },
                j: r.j
            },function(eeee,rrrr) {
                //console.log('1');

                if(eeee){
                    cb(code.requestError);
                    //console.log(eeee);
                    return;
                }
                //console.log(o);
                

                var list = pages.exam(r.data);
                if(list.length>0) {

                    conn.query({
                        sql:"select examVersion from scu_user where id="+ o.studentId

                    },function(errr,roww) {

                        if (errr) {
                            cb(code.mysqlError);
                            return;
                        }


                        if(roww.length==0){

                            roww=[];
                            roww[0]={
                                examVersion:0
                                };
                        }
                        var sql;
                        var listSql = [];
                        for (var i = 0; i < list.length; i++) {
                            listSql[i] = "('" + list[i].examName + "','" + list[i].name + "','" + list[i].start + "'," + list[i].end + "," + o.studentId + ",'" + datas.currentTerm.termId + "'," + list[i].week + ",'" + list[i].campusId + "','" + list[i].building + "','" + list[i].classroom + "'," + (parseInt(roww[0].examVersion) + 1) + ")";
                        }
                        sql = "insert into scu_exam (`examName`,`name`,`start`,`end`,`studentId`,`termId`,`week`,`campusId`,`building`,`classroom`,`version`) VALUES " + listSql.join(',');
                        //console.log(sql);
                        conn.query(
                            {
                                sql: sql
                            }, function (eeeee) {
                                if (eeeee) {
                                    cb(code.mysqlError);
                                    console.log(eeeee);
                                    return;
                                }
                                conn.query(
                                    {
                                        sql: "update `scu_user` set `examVersion`=examVersion+1,examCount=" + list.length + ",examUpdateAt=" + common.time() + " where id=" + o.studentId
                                    }, function (eeeeee, rrrrrr) {
                                        if (eeeeee) {
                                            cb(code.mysqlError);
                                            console.log(eeeeee);
                                            return;
                                        } else {
                                            cb(null);
                                            console.log(o.studentId + '的考表成功更新');
                                            return;

                                        }
                                    }
                                )

                            });
                    });
                }else{



                    conn.query(
                        {
                            sql: "update `scu_user` set `examVersion`=examVersion+1,examCount=" + list.length + ",examUpdateAt=" + common.time() + " where id=" + o.studentId
                        }, function (eeeeee, rrrrrr) {
                            if (eeeeee) {
                                cb(code.mysqlError);
                                console.log(eeeeee);
                                return;
                            } else {
                                cb(null);
                                console.log('成功更新');
                                return;

                            }
                        }
                    );

                }

            });

    });
};


//todo 根据参数更新图书馆信息
updates.library = function(o,cb){
    //console.log(o);
    libs.checkLib(o,function(e,r){
        
        //console.log(e,r);
        if(e){
            cb(e);

            if(e.code == 2015){


                conn.query({
                        sql: "update `scu_library` set error=1 where id='" + o.studentId+"'"
                    }, function (eeee, rrrr) {
                        if (eeee) {
                            console.log(eeee);
                            return;
                        }
                        console.log(o.studentId+'的帐号密码有问题');
                        return;
                    }
                );
            }

            return;
        }

        request.get({
            url:"http://mc.m.5read.com/cmpt/opac/opacLink.jspx?stype=1",
            jar:r
        },function(ee,rr,bb){
            //console.log(bb)
            
            if(ee){
                console.log(ee);
                cb(code.requestLibError);
                return;
            }

            var list = pages.library(bb);
            if(list.length>0) {


                conn.query({
                    sql:"select version from scu_library where id='"+ o.studentId +"'"

                },function(errr,roww){

                    if(errr){
                        cb(code.mysqlError);
                        return;
                    }



                var sql;
                var listSql = [];
                for (var i = 0; i < list.length; i++) {
                    //console.log(list[i]);
                    listSql[i] = "('"+ o.studentId+"','" + list[i].barcode + "','" + list[i].borId + "','" + list[i].name + "'," + list[i].deadline + ",'" + list[i].author + "','" + list[i].location + "','" + list[i].index + "'," + (parseInt(roww[0].version) + 1) + ")";
                }
                sql = "insert into scu_book (`studentId`,`barcode`,`borId`,`name`,`deadline`,`author`,`location`,`index`,`version`) VALUES " + listSql.join(',');
                //console.log(sql);
                conn.query(
                    {
                        sql: sql
                    }, function (eeeee,rw) {
                        //console.log('1');
                        if (eeeee) {
                            cb(code.mysqlError);
                            console.log(eeeee);
                            return;
                        }
                        //console.log(rw);
                        //console.log('2');
                        //console.log("update `scu_library` set `count`="+list.length+",`version`=version+1,updateAt=" + common.time() + " where id='" + o.studentId+"'");


                        conn.query(
                            {
                                sql: "update `scu_library` set `count`="+list.length+",`version`=version+1,updateAt=" + common.time() + " where id='" + o.studentId+"'"
                            }, function (eeeeee, rrrrrr) {
                                if (eeeeee) {
                                    cb(code.mysqlError);
                                    console.log(eeeeee);
                                    return;
                                } else {
                                    //console.log(rrrrrr);
                                    //console.log('4');
                                    cb(null);
                                    console.log(o.studentId + '的图书成功更新到最新版本'); ;
                                    return;

                                }
                            }
                        )

                    });
                });

            }else{
                //console.log("update `scu_library` set `count`=0,`version`=version+1"  + ",updateAt=" + common.time() + " where id='" + o.studentId+"'");
                conn.query(
                    {
                        sql: "update `scu_library` set `count`=0,`version`=version+1"  + ",updateAt=" + common.time() + " where id='" + o.studentId+"'"
                    }, function (eeeeee, rrrrrr) {
                        if (eeeeee) {
                            cb(code.mysqlError);
                            console.log(eeeeee);
                            return;
                        } else {
                            //console.log('222');
                            cb(null);
                            console.log(o.studentId + '的图书成功更新到版本');
                            return;

                        }
                    }
                );
                return;
            }
        });
    })


};

//todo 根据参数续借信息
updates.renew = function(o,cb){
    //console.log(o);
    libs.checkLib(o,function(e,r){
        if(e){
            cb(e);

            if(e.code == 2015){
                conn.query({
                        sql: "update `scu_library` set error=1 where id='" + o.studentId+"'"
                    }, function (eeee, rrrr) {
                        if (eeee) {
                            cb(code.mysqlError);
                            console.log(eeee);
                            return;
                        }
                        console.log(o.studentId+'的帐号密码有问题');
                        return;
                    }
                );
            }

            return;
        }
        request.post(
            {
                url:"http://202.115.54.52:90/sms/opac/user/renew.action",
                jar:r,
                form:{
                    barcode:o.barcode,
                    bor_id:o.borId
                }

            },function(ee,rr,bb){
                
                
                request.get({
                    url:"http://mc.m.5read.com/user/logout/logout.jspx",
                    jar:r
                },function(eee,rrr,bbb) {
                    //console.log(eee, rrr.statusCode);
                    if (ee) {
                        cb(code.requestLibError);
                        console.log(ee);
                        return;
                    }
                    var $ = cheerio.load(bb);
                    var text = $(".boxBd").text().trim();
                    //console.log(text);
                    var status = text.indexOf("续借操作不成功") >= 0;
                    if (status) {
                        //console.log(o.studentId+"续借失败"+text.substr(12));
                        cb({
                            code: code.renewError.code,
                            message: text.substr(12)
                        });
                        return;

                    } else {
                        //成功
                        console.log(o.studentId+"续借成功");
                        cb(null);
                        return;

                    }
                });
            }
        );


    })


};
//todo 根据参数来更新教务处
updates.newsTeaching = function(o,cb){

};

//todo 根据参数来更新讲座

updates.newsLectures = function(o,cb){

};

//todo 根据参数来


module.exports = updates;