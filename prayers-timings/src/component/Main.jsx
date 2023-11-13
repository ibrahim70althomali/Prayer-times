import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import "./Main.css"
import { Divider, Stack } from '@mui/material';
import Prayers from './Prayers';



import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from "moment";

const Main = () => {

    //    من اسمها
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
 
    // const [timer, setTimer] = useState(10)
    const [date, setDate] = useState("")
    // لي حساب الوقت
    const [remainingTime, setRemainingTime] = useState("");

    const [timings, setTimings] = useState({
        Fajr: "04:20",
        Dhuhr: "11:50",
        Asr: "15:18",
        Sunset: "18:03",
        Isha: "19:33",
    })
    const [selectCity, setSelectCity] = useState({

        displayName: "مكه المكرمه",
        aipName: 'Makkah al Mukarramah',
    })


    const city = [
        {
            displayName: "مكه المكرمه",
            aipName: 'Makkah al Mukarramah'
        },
        {
            displayName: "الطايف ",
            aipName: 'Taif'
        },
        { displayName: " الرياض", aipName: 'Riyadh' }
    ]
    // عشان نطلع متبقي علي صلاه 
    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Sunset", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" },
    ];



        const handleChange = (event) => {
        const cityObject = city.find((itme) => {
            return itme.aipName == event.target.value
        })
        setSelectCity(cityObject);
        }

        // حساب فارق الوقت
        const setupCountDownTimer = () => {
           
        const momentNow = moment();


        let prayerIndex = 2;
        if ( 
            // في مومنت لما نعرف علي انه اوبجت في ممونت ولما  احول من  نص لي اوبجت لازم اعطيه صيغه
            // isAfter:isBefore داله في مكتبه مومنت
            // تحويل للوبجت(moment(timings["Fajr"],"hh:mm" صغيه))
            // اذ كنت بعد الفجر وقبل الظهر في صلاه القادمه هي الظهر
            momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
        ){
            // الظهر في مصفوفه انكس 1
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
        ) {
            prayerIndex = 4;
        } else {
            // شوف وقت الفجر4 وقت  العشاء 7 وساعه 4 قبل ساعه 7 ف سويتها بي else
            prayerIndex = 0;
        }
        // قيمه الي راح تغير لي اسمه الصلاه
        setNextPrayerIndex(prayerIndex);




        // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
        // prayerIndex اول شي نحدد مصفوفه عشان اجيب صلوت وبعدها حدد الصلاه عن طريقه 
        const nextPrayerObject = prayersArray[prayerIndex];
        //هنا قدرن اظهر وقت الصلاه القادمه key بس ابي nextPrayerObject هنا قلت ابي توقيت صلاه علي حساب موجود في   
        const nextPrayerTime = timings[nextPrayerObject.key];
            // من نص الي اوبجت عشان احسب فرق الوقت nextPrayerTime يسوي تحول
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
            
        
             
             //   تحسب فرق توقيت diffفي مومنت في داله
            //  عشان نحسب صح ف راح يكون الوقت قادم ناقص الوقت الوقت  بس راح يعطيك رقم كبير مو مفهوم
            let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
            //    هنا لين وقت صلاه الوقت قبل العشاء ف للازم نسوي حالتين
          if (remainingTime < 0) {
            // نحسب فرق مابين وقت العشاء الي منتصف الليل 
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            //    نحسب فرق مابين منصف  الليل الا فجر
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );

            const totalDiffernce = midnightDiff + fajrToMidnightDiff;
            remainingTime = totalDiffernce;
        }


        //  تحول الوقت الي طلع لصغيه مفهومهduration داله 
        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(
            `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );
        //   duration خواص الداله 
        // console.log(
        //     durationRemainingTime.hours(),
        //     durationRemainingTime.minutes(),
        //     durationRemainingTime.seconds()
        // );

    }






// API
    const grtTimings = async () => {
        const res = await axios.get(
            `http://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectCity.aipName}`
        )
        // console.log(res.data.data.date.hijri.date)
        setDate(res.data.data.date.hijri.date)
        setTimings(res.data.data.timings)
        // console.log(res.data.data.date.hijri.month.ar)
    }


    // هنا عشان نحدث الوقت علي حسب المدينه
    useEffect(() => {
        grtTimings();
    }, [selectCity])


      // للعداد
    useEffect(() => {
        // عشان ننفذ شي متكرر نستخدم
        let inte = setInterval(() => {
            // setTimer((collbak) => {
            //     return collbak - 1;

            // });
            setupCountDownTimer();
        }, 1000);
        // نسوي تنظيف للمونت اذ سوا ان مونت
        return () => {
            clearInterval(inte);
        }
        // اذ كانت المصفوفه فاضي يستدعيها مره وحده
    }, [timings])




    return (
        <>
            <Grid container  >
                <Grid xs={6}>
                    <div>
                        <h2> التاريخ : {date}</h2>
                        <h1>{selectCity.displayName}</h1>
                    </div>
                </Grid>


                <Grid xs={6}>
                    <div>
                        <h2>متبقي علي صلاه 
            {prayersArray[nextPrayerIndex].displayName}</h2>
                       
                        <h1>{remainingTime}</h1>
                    </div>
                </Grid>
            </Grid>

            <Divider style={{ borderColor: "#000", opacity: "0.5" }} />


            <Stack direction={'row'} justifyContent={'space-around'} marginTop={"50px"}>
                <Prayers n="الفجر" s={timings.Fajr} i="./public/img/fajr-prayer.png" />
                <Prayers n="الظهر" s={timings.Dhuhr} i="./public/img/dhhr-prayer-mosque.png" />
                <Prayers n="العصر" s={timings.Asr} i="./public/img/asr-prayer-mosque.png" />
                <Prayers n="المغرب" s={timings.Sunset} i="./public/img/sunset-prayer-mosque.png" />
                <Prayers n="العشاء" s={timings.Isha} i="./public/img/night-prayer-mosque.png" />
            </Stack>



            <Stack direction={'row'} justifyContent={'center'} sx={{ color: "#000" }}>
                <FormControl sx={{ width: "28%", mt: 3, color: "#000" }}>
                    <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectCity}
                        label="المدينه"
                        onChange={handleChange}
                        sx={{ color: "#000" }}
                    >
                        {city.map((item) => {
                            return (
                                <MenuItem sx={{ color: "#000" }} value={item.aipName} key={item.aipName}>{item.displayName}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Stack>

        </>
    )
}

export default Main
