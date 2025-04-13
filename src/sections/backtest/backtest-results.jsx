import React, { useCallback, useContext, useState } from 'react';
import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { format } from 'date-fns';
import { BacktestContext } from 'src/context/BacktestContext';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

import CardHeader from '@mui/material/CardHeader';
import { Chart, useChart, ChartLegends, ChartSelect } from 'src/components/chart';
import { useTheme } from '@emotion/react';
import * as XLSX from 'xlsx';

export function BacktestResults() {
    // const { results } = useContext(BacktestContext);
    const results = {
        "withDividends": {
            "dailyReturns": [
                {
                    "current": 0.00400515845725713,
                    "accumulated": 0.00400515845725713,
                    "date": "2024-12-03"
                },
                {
                    "current": 0.007225324427813762,
                    "accumulated": 0.01125942145430936,
                    "date": "2024-12-04"
                },
                {
                    "current": 0.007733403532789396,
                    "accumulated": 0.019079898636750636,
                    "date": "2024-12-05"
                },
                {
                    "current": -0.0049709886642255174,
                    "accumulated": 0.014014064012687122,
                    "date": "2024-12-06"
                },
                {
                    "current": -0.005820535432584872,
                    "accumulated": 0.008111959223962018,
                    "date": "2024-12-09"
                },
                {
                    "current": 0.01203150102745254,
                    "accumulated": 0.020241059297152253,
                    "date": "2024-12-10"
                },
                {
                    "current": 0.005362429695501714,
                    "accumulated": 0.025712030250097495,
                    "date": "2024-12-11"
                },
                {
                    "current": -0.023321152027095948,
                    "accumulated": 0.0017912440566136834,
                    "date": "2024-12-12"
                },
                {
                    "current": -0.001631783001156517,
                    "accumulated": 0.00015653813385463344,
                    "date": "2024-12-13"
                },
                {
                    "current": -0.011622626488609011,
                    "accumulated": -0.011467907739015404,
                    "date": "2024-12-16"
                },
                {
                    "current": 0.0023370612467688012,
                    "accumulated": -0.009157647695004933,
                    "date": "2024-12-17"
                },
                {
                    "current": -0.034366358407776465,
                    "accumulated": -0.043209291099922775,
                    "date": "2024-12-18"
                },
                {
                    "current": 0.009643510262586696,
                    "accumulated": -0.033982470079497284,
                    "date": "2024-12-19"
                },
                {
                    "current": 0.020677331716209668,
                    "accumulated": -0.014007805169657495,
                    "date": "2024-12-20"
                },
                {
                    "current": -0.02495107471065583,
                    "accumulated": -0.038609370086992945,
                    "date": "2024-12-23"
                },
                {
                    "current": 0.011196428875891007,
                    "accumulated": -0.02784522827722391,
                    "date": "2024-12-26"
                },
                {
                    "current": -0.0003248422508794757,
                    "accumulated": -0.028161025221473568,
                    "date": "2024-12-27"
                },
                {
                    "current": -0.0077011373987125875,
                    "accumulated": -0.03564529069566691,
                    "date": "2024-12-30"
                },
                {
                    "current": -0.007167916412026076,
                    "accumulated": -0.04255770464350406,
                    "date": "2025-01-02"
                },
                {
                    "current": -0.01961225992394411,
                    "accumulated": -0.0613353118022133,
                    "date": "2025-01-03"
                },
                {
                    "current": 0.02526354066433023,
                    "accumulated": -0.03762131828175774,
                    "date": "2025-01-06"
                },
                {
                    "current": 0.011313277919614784,
                    "accumulated": -0.026733660791566805,
                    "date": "2025-01-07"
                },
                {
                    "current": -0.016363374305779943,
                    "accumulated": -0.04265958219925059,
                    "date": "2025-01-08"
                },
                {
                    "current": 0.006769908950331027,
                    "accumulated": -0.03617847473626756,
                    "date": "2025-01-09"
                },
                {
                    "current": -0.012764801197262976,
                    "accumulated": -0.04848146489590188,
                    "date": "2025-01-10"
                },
                {
                    "current": -0.0016507792189989212,
                    "accumulated": -0.050052211920143974,
                    "date": "2025-01-13"
                },
                {
                    "current": -0.0006817382562780416,
                    "accumulated": -0.0506998276687447,
                    "date": "2025-01-14"
                },
                {
                    "current": 0.023893706937270887,
                    "accumulated": -0.028017527555561084,
                    "date": "2025-01-15"
                },
                {
                    "current": -0.006639798156601762,
                    "accumulated": -0.03447129498434687,
                    "date": "2025-01-16"
                },
                {
                    "current": 0.010686397574111606,
                    "accumulated": -0.024153271373332452,
                    "date": "2025-01-17"
                },
                {
                    "current": 0.004780546596892865,
                    "accumulated": -0.019488190615707057,
                    "date": "2025-01-20"
                },
                {
                    "current": 0.004376396791954562,
                    "accumulated": -0.015197081878644103,
                    "date": "2025-01-21"
                },
                {
                    "current": -0.0023758521750361083,
                    "accumulated": -0.017536828033644647,
                    "date": "2025-01-22"
                },
                {
                    "current": -0.009386235340690274,
                    "accumulated": -0.02675845857928194,
                    "date": "2025-01-23"
                },
                {
                    "current": -0.00015799239353675443,
                    "accumulated": -0.0269122233399004,
                    "date": "2025-01-24"
                },
                {
                    "current": 0.012490340350273188,
                    "accumulated": -0.014758025818725207,
                    "date": "2025-01-27"
                },
                {
                    "current": 0.005117486539695459,
                    "accumulated": -0.009716063277509512,
                    "date": "2025-01-28"
                },
                {
                    "current": -0.0037684413620058255,
                    "accumulated": -0.013447890224784542,
                    "date": "2025-01-29"
                },
                {
                    "current": 0.021496033858987573,
                    "accumulated": 0.0077590673305991675,
                    "date": "2025-01-30"
                },
                {
                    "current": 0.002756094915475682,
                    "accumulated": 0.010536546972093497,
                    "date": "2025-01-31"
                },
                {
                    "current": -0.0066055921836347675,
                    "accumulated": 0.003861354656137239,
                    "date": "2025-02-03"
                },
                {
                    "current": 0.002866825889065394,
                    "accumulated": 0.0067392503766976475,
                    "date": "2025-02-04"
                },
                {
                    "current": 0.000811696616937807,
                    "accumulated": 0.007556417220366818,
                    "date": "2025-02-05"
                },
                {
                    "current": 0.0031331464501411777,
                    "accumulated": 0.010713239032297706,
                    "date": "2025-02-06"
                },
                {
                    "current": -0.005663303472935199,
                    "accumulated": 0.004989263235544605,
                    "date": "2025-02-07"
                },
                {
                    "current": -0.002766804608210549,
                    "accumulated": 0.0022086543108224,
                    "date": "2025-02-10"
                },
                {
                    "current": 0.01228570587212352,
                    "accumulated": 0.014521495060181744,
                    "date": "2025-02-11"
                },
                {
                    "current": -0.017900294704917608,
                    "accumulated": -0.0036387386858690585,
                    "date": "2025-02-12"
                },
                {
                    "current": -0.0008421382851870884,
                    "accumulated": -0.004477812649898993,
                    "date": "2025-02-13"
                },
                {
                    "current": 0.024846835538199885,
                    "accumulated": 0.02025776341381791,
                    "date": "2025-02-14"
                },
                {
                    "current": -0.00003190732139102259,
                    "accumulated": 0.020225209721459025,
                    "date": "2025-02-17"
                },
                {
                    "current": -0.0009938388333671222,
                    "accumulated": 0.01921127028925773,
                    "date": "2025-02-18"
                },
                {
                    "current": -0.010355630560222595,
                    "accumulated": 0.008656694911326923,
                    "date": "2025-02-19"
                },
                {
                    "current": -0.001186145380220438,
                    "accumulated": 0.007460281432429383,
                    "date": "2025-02-20"
                },
                {
                    "current": 0.0017479069124100022,
                    "accumulated": 0.009221228222323852,
                    "date": "2025-02-21"
                },
                {
                    "current": -0.006433799041412169,
                    "accumulated": 0.002728101651614079,
                    "date": "2025-02-24"
                },
                {
                    "current": 0.005997826888150204,
                    "accumulated": 0.008742291221204068,
                    "date": "2025-02-25"
                },
                {
                    "current": -0.00312811781070943,
                    "accumulated": 0.00558682649361919,
                    "date": "2025-02-26"
                },
                {
                    "current": 0.0021248753580331847,
                    "accumulated": 0.007723573161598329,
                    "date": "2025-02-27"
                },
                {
                    "current": -0.013282675090675933,
                    "accumulated": -0.005661691641922206,
                    "date": "2025-02-28"
                },
                {
                    "current": 0.0013561774200194776,
                    "accumulated": -0.0043131924802667365,
                    "date": "2025-03-05"
                },
                {
                    "current": 0.0031798243386254033,
                    "accumulated": -0.0011470833360671673,
                    "date": "2025-03-06"
                },
                {
                    "current": 0.011470974599216976,
                    "accumulated": 0.01031073309933861,
                    "date": "2025-03-07"
                },
                {
                    "current": 0.0004511720914881501,
                    "accumulated": 0.010766557105843955,
                    "date": "2025-03-10"
                },
                {
                    "current": -0.008630189966262747,
                    "accumulated": 0.0020434497064751866,
                    "date": "2025-03-11"
                },
                {
                    "current": 0.00011929921201692117,
                    "accumulated": 0.002162992700431854,
                    "date": "2025-03-12"
                },
                {
                    "current": 0.011074761491238316,
                    "accumulated": 0.013261708819934714,
                    "date": "2025-03-13"
                },
                {
                    "current": 0.025918563223257918,
                    "accumulated": 0.03952399648169047,
                    "date": "2025-03-14"
                },
                {
                    "current": 0.016084078444239314,
                    "accumulated": 0.05624378198577129,
                    "date": "2025-03-17"
                },
                {
                    "current": 0.004113308427274198,
                    "accumulated": 0.06058843843546935,
                    "date": "2025-03-18"
                },
                {
                    "current": 0.0005660893831234137,
                    "accumulated": 0.061188826290331066,
                    "date": "2025-03-19"
                },
                {
                    "current": -0.0002132425153296147,
                    "accumulated": 0.06096253571577326,
                    "date": "2025-03-20"
                },
                {
                    "current": -0.00008581559237386127,
                    "accumulated": 0.060871488587284306,
                    "date": "2025-03-21"
                },
                {
                    "current": -0.002457776001696388,
                    "accumulated": 0.05826410410175065,
                    "date": "2025-03-24"
                },
                {
                    "current": 0.005876289072110463,
                    "accumulated": 0.06448276989209067,
                    "date": "2025-03-25"
                },
                {
                    "current": -0.0058081555340424584,
                    "accumulated": 0.058300088401249006,
                    "date": "2025-03-26"
                },
                {
                    "current": 0.0032517663122089147,
                    "accumulated": 0.06174143297691992,
                    "date": "2025-03-27"
                },
                {
                    "current": -0.002514984017525368,
                    "accumulated": 0.0590711702422384,
                    "date": "2025-03-28"
                },
                {
                    "current": -0.01062470512837388,
                    "accumulated": 0.04781885134845276,
                    "date": "2025-03-31"
                },
                {
                    "current": -0.0009716044016463421,
                    "accumulated": 0.04680078594035453,
                    "date": "2025-04-01"
                },
                {
                    "current": -0.00035704649251599996,
                    "accumulated": 0.046427029391371555,
                    "date": "2025-04-02"
                },
                {
                    "current": 0.014311934116967961,
                    "accumulated": 0.06140342409423538,
                    "date": "2025-04-03"
                },
                {
                    "current": -0.014228045830549041,
                    "accumulated": 0.04630172753152095,
                    "date": "2025-04-04"
                },
                {
                    "current": -0.004301329586162028,
                    "accumulated": 0.04180123895483723,
                    "date": "2025-04-07"
                },
                {
                    "current": 0.0002690569770040785,
                    "accumulated": 0.04208154284682952,
                    "date": "2025-04-08"
                },
                {
                    "current": 0.017035557267809365,
                    "accumulated": 0.05983398264772388,
                    "date": "2025-04-09"
                },
                {
                    "current": -0.009643935399009318,
                    "accumulated": 0.0496130121853946,
                    "date": "2025-04-10"
                },
                {
                    "current": 0.008799247799611054,
                    "accumulated": 0.05884881717330992,
                    "date": "2025-04-11"
                }
            ],
            "monthlyReturns": [
                {
                    "date": "2024-12-03",
                    "current": -0.03564529069566691,
                    "accumulated": -0.03564529069566691
                },
                {
                    "date": "2025-01-02",
                    "current": 0.04788884963404705,
                    "accumulated": 0.010536546972093497
                },
                {
                    "date": "2025-02-03",
                    "current": -0.01602934467095818,
                    "accumulated": -0.005661691641922206
                },
                {
                    "date": "2025-03-05",
                    "current": 0.05378505740031869,
                    "accumulated": 0.04781885134845276
                },
                {
                    "date": "2025-04-01",
                    "current": 0.010526596091168239,
                    "accumulated": 0.05884881717330992
                }
            ],
            "totalReturn": 0.05884881717330992,
            "avgDailyReturn": 0.0006497988231893276,
            "volatility": 0.011017550133219173
        },
        "withoutDividends": {
            "dailyReturns": [
                {
                    "current": 0.004005148181389195,
                    "accumulated": 0.004005148181389195,
                    "date": "2024-12-03"
                },
                {
                    "current": 0.007225368812528554,
                    "accumulated": 0.011259455666677187,
                    "date": "2024-12-04"
                },
                {
                    "current": 0.007733397349078741,
                    "accumulated": 0.01907992686036053,
                    "date": "2024-12-05"
                },
                {
                    "current": -0.0049710122027707415,
                    "accumulated": 0.01401406810833894,
                    "date": "2024-12-06"
                },
                {
                    "current": -0.005820512009470091,
                    "accumulated": 0.008111987047142666,
                    "date": "2024-12-09"
                },
                {
                    "current": 0.012031505876038517,
                    "accumulated": 0.020241092343005418,
                    "date": "2024-12-10"
                },
                {
                    "current": 0.005362437207764081,
                    "accumulated": 0.0257120711374752,
                    "date": "2024-12-11"
                },
                {
                    "current": -0.02332120095607637,
                    "accumulated": 0.0017912338034049569,
                    "date": "2024-12-12"
                },
                {
                    "current": -0.0016317516106347796,
                    "accumulated": 0.0001565593441263946,
                    "date": "2024-12-13"
                },
                {
                    "current": -0.011622658368388272,
                    "accumulated": -0.01146791866003305,
                    "date": "2024-12-16"
                },
                {
                    "current": 0.0023370869852501475,
                    "accumulated": -0.009157633198231263,
                    "date": "2024-12-17"
                },
                {
                    "current": -0.03436635909875985,
                    "accumulated": -0.04320927778600592,
                    "date": "2024-12-18"
                },
                {
                    "current": 0.009643497115985555,
                    "accumulated": -0.033982469215733446,
                    "date": "2024-12-19"
                },
                {
                    "current": 0.020677365369201617,
                    "accumulated": -0.01400777177865331,
                    "date": "2024-12-20"
                },
                {
                    "current": -0.02495111171587394,
                    "accumulated": -0.03860937401598752,
                    "date": "2024-12-23"
                },
                {
                    "current": 0.01119647230801979,
                    "accumulated": -0.027845190494967698,
                    "date": "2024-12-26"
                },
                {
                    "current": -0.00032486035431256166,
                    "accumulated": -0.02816100505083008,
                    "date": "2024-12-27"
                },
                {
                    "current": -0.0077011373987125875,
                    "accumulated": -0.0356452706803605,
                    "date": "2024-12-30"
                },
                {
                    "current": -0.007167921708011837,
                    "accumulated": -0.04255768987887465,
                    "date": "2025-01-02"
                },
                {
                    "current": -0.019612261771882022,
                    "accumulated": -0.06133529909644564,
                    "date": "2025-01-03"
                },
                {
                    "current": 0.025263549602742907,
                    "accumulated": -0.03762129686482474,
                    "date": "2025-01-06"
                },
                {
                    "current": 0.011313296263103512,
                    "accumulated": -0.026733621478955194,
                    "date": "2025-01-07"
                },
                {
                    "current": -0.01636337416272482,
                    "accumulated": -0.04265954339069522,
                    "date": "2025-01-08"
                },
                {
                    "current": 0.00676986903821275,
                    "accumulated": -0.036178473874467265,
                    "date": "2025-01-09"
                },
                {
                    "current": -0.012764781825966631,
                    "accumulated": -0.04848144537462995,
                    "date": "2025-01-10"
                },
                {
                    "current": -0.0016507908569808327,
                    "accumulated": -0.05005220350485318,
                    "date": "2025-01-13"
                },
                {
                    "current": -0.0006817332032310608,
                    "accumulated": -0.05069981445906013,
                    "date": "2025-01-14"
                },
                {
                    "current": 0.02389373236898873,
                    "accumulated": -0.028017489887913527,
                    "date": "2025-01-15"
                },
                {
                    "current": -0.006639815806739335,
                    "accumulated": -0.034471274722429945,
                    "date": "2025-01-16"
                },
                {
                    "current": 0.010686417047178765,
                    "accumulated": -0.024153232093082955,
                    "date": "2025-01-17"
                },
                {
                    "current": 0.004780508250853854,
                    "accumulated": -0.01948818856753487,
                    "date": "2025-01-20"
                },
                {
                    "current": 0.004376384414264356,
                    "accumulated": -0.01519709195797958,
                    "date": "2025-01-21"
                },
                {
                    "current": -0.0023758222425269704,
                    "accumulated": -0.01753680861141116,
                    "date": "2025-01-22"
                },
                {
                    "current": -0.009386233916153786,
                    "accumulated": -0.026758437939795376,
                    "date": "2025-01-23"
                },
                {
                    "current": -0.00015798755949492094,
                    "accumulated": -0.026912197998984366,
                    "date": "2025-01-24"
                },
                {
                    "current": 0.012490329468734851,
                    "accumulated": -0.014758010749984507,
                    "date": "2025-01-27"
                },
                {
                    "current": 0.005117486539695459,
                    "accumulated": -0.00971604813165483,
                    "date": "2025-01-28"
                },
                {
                    "current": -0.0037684660147423443,
                    "accumulated": -0.013447899549215436,
                    "date": "2025-01-29"
                },
                {
                    "current": 0.021496053361836465,
                    "accumulated": 0.007759077046306517,
                    "date": "2025-01-30"
                },
                {
                    "current": 0.0027561055426392755,
                    "accumulated": 0.01053656742419884,
                    "date": "2025-01-31"
                },
                {
                    "current": -0.0066055786967802455,
                    "accumulated": 0.0038613886021039434,
                    "date": "2025-02-03"
                },
                {
                    "current": 0.0028668244598264447,
                    "accumulated": 0.006739282985223971,
                    "date": "2025-02-04"
                },
                {
                    "current": 0.0008117040951960419,
                    "accumulated": 0.007556457384017667,
                    "date": "2025-02-05"
                },
                {
                    "current": 0.0031331389643007856,
                    "accumulated": 0.010713271779380529,
                    "date": "2025-02-06"
                },
                {
                    "current": -0.005663343018418532,
                    "accumulated": 0.004989255828025785,
                    "date": "2025-02-07"
                },
                {
                    "current": -0.002766785413320094,
                    "accumulated": 0.0022086662144573666,
                    "date": "2025-02-10"
                },
                {
                    "current": 0.012285687167132187,
                    "accumulated": 0.014521488363756996,
                    "date": "2025-02-11"
                },
                {
                    "current": -0.01790029033465279,
                    "accumulated": -0.003638740828698306,
                    "date": "2025-02-12"
                },
                {
                    "current": -0.0008421310797104287,
                    "accumulated": -0.004477807611665829,
                    "date": "2025-02-13"
                },
                {
                    "current": 0.02484682344319289,
                    "accumulated": 0.020257756536387284,
                    "date": "2025-02-14"
                },
                {
                    "current": -0.00003189403444536776,
                    "accumulated": 0.020225216400357127,
                    "date": "2025-02-17"
                },
                {
                    "current": -0.031987035096386895,
                    "accumulated": -0.012408763402860012,
                    "date": "2025-02-18"
                },
                {
                    "current": -0.010355630560222595,
                    "accumulated": -0.022635893393573414,
                    "date": "2025-02-19"
                },
                {
                    "current": -0.001186145380220438,
                    "accumulated": -0.02379518931341784,
                    "date": "2025-02-20"
                },
                {
                    "current": 0.0017479069124100022,
                    "accumulated": -0.02208887417689087,
                    "date": "2025-02-21"
                },
                {
                    "current": -0.006433799041412169,
                    "accumulated": -0.02838055784079785,
                    "date": "2025-02-24"
                },
                {
                    "current": 0.005997826888150204,
                    "accumulated": -0.022552952625565892,
                    "date": "2025-02-25"
                },
                {
                    "current": -0.00312811781070943,
                    "accumulated": -0.02561052214348325,
                    "date": "2025-02-26"
                },
                {
                    "current": 0.0021248753580331847,
                    "accumulated": -0.023540065952858957,
                    "date": "2025-02-27"
                },
                {
                    "current": -0.013282675090675933,
                    "accumulated": -0.036510065995870034,
                    "date": "2025-02-28"
                },
                {
                    "current": 0.0013561774200194776,
                    "accumulated": -0.03520340270295763,
                    "date": "2025-03-05"
                },
                {
                    "current": 0.0031798243386254033,
                    "accumulated": -0.032135519001049495,
                    "date": "2025-03-06"
                },
                {
                    "current": 0.011470974599216976,
                    "accumulated": -0.021033170124026168,
                    "date": "2025-03-07"
                },
                {
                    "current": 0.0004511720914881501,
                    "accumulated": -0.020591487611893555,
                    "date": "2025-03-10"
                },
                {
                    "current": -0.008630189966262747,
                    "accumulated": -0.0290439691283777,
                    "date": "2025-03-11"
                },
                {
                    "current": 0.00011929921201692117,
                    "accumulated": -0.028928134838991704,
                    "date": "2025-03-12"
                },
                {
                    "current": 0.011074761491238316,
                    "accumulated": -0.018173745541481656,
                    "date": "2025-03-13"
                },
                {
                    "current": 0.025918563223257918,
                    "accumulated": 0.007273780308955979,
                    "date": "2025-03-14"
                },
                {
                    "current": 0.016084078444239314,
                    "accumulated": 0.023474850806270764,
                    "date": "2025-03-17"
                },
                {
                    "current": 0.004113308427274198,
                    "accumulated": 0.027684718535195385,
                    "date": "2025-03-18"
                },
                {
                    "current": 0.0005660893831234137,
                    "accumulated": 0.028266479943556355,
                    "date": "2025-03-19"
                },
                {
                    "current": -0.0002132425153296147,
                    "accumulated": 0.028047209812944285,
                    "date": "2025-03-20"
                },
                {
                    "current": -0.00008581559237386127,
                    "accumulated": 0.02795898733264579,
                    "date": "2025-03-21"
                },
                {
                    "current": -0.002457776001696388,
                    "accumulated": 0.025432494402851447,
                    "date": "2025-03-24"
                },
                {
                    "current": 0.005876289072110463,
                    "accumulated": 0.03145823216389809,
                    "date": "2025-03-25"
                },
                {
                    "current": -0.0058081555340424584,
                    "accumulated": 0.025467362324621545,
                    "date": "2025-03-26"
                },
                {
                    "current": 0.0032517663122089147,
                    "accumulated": 0.028801942547698633,
                    "date": "2025-03-27"
                },
                {
                    "current": -0.002514984017525368,
                    "accumulated": 0.02621452210499209,
                    "date": "2025-03-28"
                },
                {
                    "current": -0.01062470512837388,
                    "accumulated": 0.015311295409171422,
                    "date": "2025-03-31"
                },
                {
                    "current": -0.0009716044016463421,
                    "accumulated": 0.014324814485510595,
                    "date": "2025-04-01"
                },
                {
                    "current": -0.00035704649251599996,
                    "accumulated": 0.013962653368226663,
                    "date": "2025-04-02"
                },
                {
                    "current": 0.014311934116967961,
                    "accumulated": 0.028474420060298655,
                    "date": "2025-04-03"
                },
                {
                    "current": -0.014228045830549041,
                    "accumulated": 0.01384123887613331,
                    "date": "2025-04-04"
                },
                {
                    "current": -0.004301329586162028,
                    "accumulated": 0.00948037355968423,
                    "date": "2025-04-07"
                },
                {
                    "current": 0.0002690569770040785,
                    "accumulated": 0.00975198129733923,
                    "date": "2025-04-08"
                },
                {
                    "current": 0.017035557267809365,
                    "accumulated": 0.026953669001014147,
                    "date": "2025-04-09"
                },
                {
                    "current": -0.009643935399009318,
                    "accumulated": 0.017049794159392784,
                    "date": "2025-04-10"
                },
                {
                    "current": 0.008799247799611054,
                    "accumulated": 0.025999067322744596,
                    "date": "2025-04-11"
                }
            ],
            "monthlyReturns": [
                {
                    "date": "2024-12-03",
                    "current": -0.0356452706803605,
                    "accumulated": -0.0356452706803605
                },
                {
                    "date": "2025-01-02",
                    "current": 0.04788884909305202,
                    "accumulated": 0.01053656742419884
                },
                {
                    "date": "2025-02-03",
                    "current": -0.04655609201751898,
                    "accumulated": -0.036510065995870034
                },
                {
                    "date": "2025-03-05",
                    "current": 0.05378505740031869,
                    "accumulated": 0.015311295409171422
                },
                {
                    "date": "2025-04-01",
                    "current": 0.010526596091168239,
                    "accumulated": 0.025999067322744596
                }
            ],
            "totalReturn": 0.025999067322744596,
            "avgDailyReturn": 0.0002916686102955155,
            "volatility": 0.011563845440160281
        },
        "computedDays": 88,
        "assetsDates": {
            "TAEE3": {
                "start": 1733097600000,
                "end": 1744329600000
            },
            "ITSA4": {
                "start": 1733097600000,
                "end": 1744329600000
            }
        }
    }

    const [currentDividendMode, setCurrentDividendMode] = useState('Com Dividendos');
    const dividendsKeyValue = {
        'Com Dividendos': 'withDividends',
        'Sem Dividendos': 'withoutDividends',
    };

    const handleChangeDividendMode = useCallback((dividendMode) => {
        setCurrentDividendMode(dividendMode);
    }, []);

    if (!results || !results.withDividends.dailyReturns || !results.withoutDividends.dailyReturns) {
        return <Typography>Nenhum resultado disponível.</Typography>;
    };

    const handleDownload = useCallback(() => {
        const ws = XLSX.utils.json_to_sheet(
            results[dividendsKeyValue[currentDividendMode]].dailyReturns.map(({ accumulated, current, date }, index) => ({
                Data: format(new Date(date), 'dd/MM/yyyy'),
                'Retorno Diário': `${(current * 100).toFixed(2)}%`,
                'Retorno Acumulado': `${(accumulated * 100).toFixed(2)}%`,
                'Retorno Total': index === 0 ? `${(results[dividendsKeyValue[currentDividendMode]].totalReturn * 100).toFixed(2)}%` : '',
                'Retorno Médio Diário': index === 0 ? `${(results[dividendsKeyValue[currentDividendMode]].avgDailyReturn * 100).toFixed(2)}%` : '',
                'Volatilidade': index === 0 ? `${(results[dividendsKeyValue[currentDividendMode]].volatility * 100).toFixed(2)}%` : '',
                'Dias Computados': index === 0 ? results.computedDays : ''
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
        XLSX.writeFile(wb, 'backtest_results.xlsx');
    }, [results]);

    if (results[dividendsKeyValue[currentDividendMode]].dailyReturns.length > 30) {
        const step = Math.ceil(results[dividendsKeyValue[currentDividendMode]].dailyReturns.length / 30);
        const reducedData = results[dividendsKeyValue[currentDividendMode]].dailyReturns.filter((_, index) => index % step === 0);
        if (reducedData[reducedData.length - 1].date !== results[dividendsKeyValue[currentDividendMode]].dailyReturns[results[dividendsKeyValue[currentDividendMode]].dailyReturns.length - 1].date) {
            reducedData.push(results[dividendsKeyValue[currentDividendMode]].dailyReturns[results[dividendsKeyValue[currentDividendMode]].dailyReturns.length - 1]);
        }
        results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced = reducedData;
    } else {
        results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced = results[dividendsKeyValue[currentDividendMode]].dailyReturns;
    }

    /********************************************* */

    const chart = {
        categories: results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced.map(({ date }) => format(new Date(date), 'dd/MM/yyyy')),
        series: [
            {
                name: 'backtest_results',
                data: [
                    {
                        name: 'Retorno Diário',
                        data: results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced.map(({ current }) => (current * 100).toFixed(2)),
                    },
                    {
                        name: 'Retorno acumulado',
                        data: results[dividendsKeyValue[currentDividendMode]].dailyReturnsReduced.map(({ accumulated }) => (accumulated * 100).toFixed(2)),
                    },
                ],
            },
        ],
    };

    const daysToExtendedDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const year = date.getFullYear() - new Date().getFullYear();
        const month = date.getMonth() - new Date().getMonth();
        const day = date.getDate() - new Date().getDate();
        const yearText = year > 0 ? `${year} ano${year > 1 ? 's' : ''}` : '';
        const monthText = month > 0 ? `${month} ${month > 1 ? 'meses' : 'mês'}` : '';
        const dayText = day > 0 ? `${day} dia${day > 1 ? 's' : ''}` : '';
        return `${yearText} ${monthText} ${dayText}`.trim().replace(/\s+/g, ' ');
    }

    const theme = useTheme();

    const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

    const chartOptions = useChart({
        colors: chartColors,
        xaxis: { categories: chart.categories },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: 'inherit'
            },
            fillSeriesColor: false,
            y: {
                formatter: (value) => `${value}%`,
            }
        },
        ...chart.options,
    });

    const currentSeries = chart.series[0];

    /********************************************* */

    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Resultados do Backtest
                </Typography>
                <Button
                    sx={{ mb: 3 }}
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </Box>

            <Box width={'100%'} display={'flex'} flexDirection={{ xs: 'column', sm: 'row', md: 'row' }} gap={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: 3 }}>
                <Card sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Retorno Médio Diário
                    </Typography>
                    <Typography variant="h4" color={'primary.main'} sx={{ textAlign: 'center' }}>
                        {`${(results[dividendsKeyValue[currentDividendMode]].avgDailyReturn * 100).toFixed(2)}%`}
                    </Typography>

                </Card>
                <Card sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Período de Teste
                    </Typography>
                    <Typography variant="h4" color={'primary.main'} sx={{ textAlign: 'center' }}>
                        {daysToExtendedDate(results.computedDays)}
                    </Typography>
                </Card>
                <Card sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                        Retorno Total
                    </Typography>
                    <Typography variant="h4" color={'primary.main'} sx={{ textAlign: 'center' }}>
                        {`${(results[dividendsKeyValue[currentDividendMode]].totalReturn * 100).toFixed(2)}%`}
                    </Typography>
                </Card>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Card sx={{ p: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        <EmojiObjectsIcon sx={{ color: 'warning.main', fontSize: '20px', transform: 'translateY(3px)' }} /> Se você tivesse investido <strong>R$1.000,00</strong> ({currentDividendMode === 'Com Dividendos' ? 'reinvestindo os dividendos' : 'sem reinvestir os dividendos'}) neste portfólio no início do período, no fim você teria aproximadamente <strong>R${(1000 * (1 + results[dividendsKeyValue[currentDividendMode]].totalReturn)).toFixed(2)}</strong>
                    </Typography>
                </Card>
            </Box>

            <Box display={'flex'} sx={{ width: '100%' }} gap={3}>

                <Box display={'flex'} flexDirection={'column'} sx={{ flex: 1 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardHeader
                            title={"Retorno Acumulado de Portfólio (%)"}
                            sx={{ mb: 3 }}
                            action={
                                <ChartSelect
                                    value={currentDividendMode}
                                    onChange={handleChangeDividendMode}
                                    options={['Com Dividendos', 'Sem Dividendos']}
                                />
                            }
                        />

                        <ChartLegends
                            colors={chartOptions?.colors}
                            labels={chart.series[0].data.map((item) => item.name)}
                            sx={{ px: 3, gap: 3 }}
                        />

                        <Chart
                            type="area"
                            series={currentSeries?.data}
                            options={chartOptions}
                            slotProps={{ loading: { p: 2.5 } }}
                            sx={{
                                pl: 1,
                                py: 2.5,
                                pr: 2.5,
                                height: 320,
                            }}
                        />
                    </Card>
                </Box>
            </Box>

            <Box>
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Intervalo de Dados dos Ativos
                    </Typography>
                    {Object.entries(results.assetsDates).map(([asset, { start, end }]) => (
                        <Box key={asset} sx={{ mb: 2 }}>
                            <Typography>
                                <strong>{asset}:</strong>
                            </Typography>
                            <Typography>
                                Início: {format(new Date(start), 'dd/MM/yyyy')}
                            </Typography>
                            <Typography>
                                Término: {format(new Date(end), 'dd/MM/yyyy')}
                            </Typography>
                        </Box>
                    ))}
                </Card>
            </Box>

        </Box >
    );
}