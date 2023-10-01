import { getDayDiffForDate, getFirstDate, getFullDayDiff, getLatestDate } from "./apiv1";
import { DayDiff, GradeCount, GradesChartDatasets } from "./types";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartConfiguration, ChartData } from "chart.js/dist/types/index";
import 'chartjs-adapter-date-fns';
import {pl} from 'date-fns/locale';
import { variant } from "./gradename";
import { plugins } from "../webpack.config";

Chart.register(zoomPlugin);

const gradeCounter = document.querySelector("#grades-count");
const gradeDetails = document.querySelector("#grades-details");

const backArrow = document.querySelector("#back");
const dateDisplay = document.querySelector("#date-display");
const datePicker: HTMLFormElement = document.querySelector("#date-picker");
const forwardArrow = document.querySelector("#forward");

dateDisplay.addEventListener("click",()=>{
    datePicker.showPicker();
})
datePicker.addEventListener("change", ()=>{
    currentDate=new Date(datePicker.value);
    updateUI(currentDate);
})

let currentDate: Date, latestDate: Date, firstDate: Date;

backArrow.addEventListener("click",()=>{
    let tempdate = new Date(currentDate.getTime());
    tempdate.setDate(currentDate.getDate()-1);
    if(tempdate<firstDate) return;
    currentDate.setDate(currentDate.getDate()-1)
    updateUI(currentDate);
});
forwardArrow.addEventListener("click",()=>{
    let tempdate = new Date(currentDate.getTime());
    tempdate.setDate(currentDate.getDate()+1);
    if(tempdate>latestDate) return;
    currentDate.setDate(currentDate.getDate()+1)
    updateUI(currentDate);
});

async function start() {
    latestDate = await getLatestDate();
    firstDate = await getFirstDate();
    datePicker.max = latestDate.toISOString().substring(0,10);
    datePicker.min = firstDate.toISOString().substring(0,10);
    currentDate = new Date(latestDate.getTime());
    updateUI(currentDate);
    const chartDataRaw = await getFullDayDiff();
    let gradesChartDatasets: GradesChartDatasets= [];
    if(!chartDataRaw) return false;
    for(let day in chartDataRaw) {
        const daydiff: DayDiff = chartDataRaw[day];
        let gradeCount: GradeCount = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}
        for(let subject in daydiff) {
            let subjectGrades = daydiff[subject].grades;
            for(let grade in subjectGrades) {
                gradeCount[grade]+=subjectGrades[grade];
            }
        }
        for(let grade in gradeCount) {
            if(!gradesChartDatasets[parseInt(grade)-1]) gradesChartDatasets[parseInt(grade)-1] = {
                label: grade,
                data: [],
                fill: "-1"
            }
            gradesChartDatasets[parseInt(grade)-1].data.push({
                x: day,
                y: gradeCount[grade]
            })
        }
    }
    const chartConfig: ChartConfiguration<"line", {
        x: string,
        y: number
    }[]> = {
        type: 'line',
        data: {
            datasets: gradesChartDatasets,
        },
        options: {
            maintainAspectRatio: false,
            transitions: {
                zoom: {
                    animation: {
                        duration: 1000,
                        easing: "easeInOutSine"
                    }
                }
            },
            interaction: {
                mode: 'index',
            },
            onClick: (e)=>{
                //@ts-ignore
                const pos = getRelativePosition(e, chart);
                const dataX = chart.scales.x.getValueForPixel(pos.x);
                let date = new Date(dataX+7200000);
                currentDate=date;
                updateUI(currentDate);
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x"
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
                    }
                },
                tooltip: {
                    callbacks: {
                      footer: (tooltipItems) => {
                        let sum = 0;
                      
                        tooltipItems.forEach(function(tooltipItem) {
                          sum += tooltipItem.parsed.y;
                        });
                        return 'Suma: ' + sum;
                      },
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    adapters: {
                        date: {
                            locale: pl
                        }
                    }
                  },
                  y: {
                    stacked: true
                  }
              }
              
        }
    };
    const chart = new Chart(
        document.getElementById('chart') as HTMLCanvasElement,
        chartConfig
    );
}

async function updateUI(date: Date) {
    dateDisplay.textContent = currentDate.toISOString().substring(0,10)
    gradeDetails.innerHTML="";
    let data = await getDayDiffForDate(date);
    if(!data) return false;
    let daydiff: DayDiff = data;
    let gradesCount = 0;
    for(let subject in daydiff) {
        let subjectGrades = daydiff[subject].grades;
        for(let grade in subjectGrades) {
            if (subjectGrades[grade] > 0) gradeDetails.innerHTML += subjectGrades[grade] + " " + variant(parseInt(grade), subjectGrades[grade]) + ", "
            let gradeCount: number = subjectGrades[parseInt(grade)];
            gradesCount+=gradeCount;
        }
        gradeDetails.innerHTML = gradeDetails.innerHTML.slice(0, -2);
        gradeDetails.innerHTML += " z " + subject.toLocaleLowerCase() + "<br>";
    }
    gradeCounter.textContent = gradesCount.toString();
    if(gradesCount==0) {
        gradeDetails.parentElement.style.display="none";
    }else{
        gradeDetails.parentElement.style.display="block";

    }
}

start();

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    Chart.defaults.color = "#ADBABD";
    Chart.defaults.borderColor = "rgba(255,255,255,0.1)";
    Chart.defaults.backgroundColor = "rgba(255,255,0,0.1)";
    Chart.defaults.elements.line.borderColor = "rgba(255,255,0,0.4)";
}
