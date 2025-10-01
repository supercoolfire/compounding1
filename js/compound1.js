let balanceChart; // Chart.js instance

const COMPOUNDS_PER_DAY = 3;
const INCREASE_RATE = 0.007619;
const msPerDay = 1000 * 60 * 60 * 24;
let withdrawals = []; // {id, date:'YYYY-MM-DD', amount:number}

let usdToPhp = 0;
const WITHDRAWAL_FEE_RATE = 0.05; // 20% fee on withdrawal amount
const DEFAULT_RATE = 0.7320340463;
const RATE_CAPS = [ 
  { max: 15.08, growth: 0.6631299735 }, 
  { max: 17.06, growth: 0.6447831184 }, 
  { max: 17.18, growth: 0.6984866123 }, 
  { max: 50.75, growth: 0.774116712981342 }, 
{ max: 51.13, growth: 0.748768472906404 }, 
{ max: 51.52, growth: 0.762761588108742 }, 
{ max: 51.9, growth: 0.77639751552795 }, 
{ max: 52.29, growth: 0.751445086705202 }, 
{ max: 52.68, growth: 0.764964620386307 }, 
{ max: 53.08, growth: 0.77828397873956 }, 
{ max: 53.48, growth: 0.753579502637528 }, 
{ max: 53.88, growth: 0.766641735228123 }, 
{ max: 54.28, growth: 0.779510022271715 }, 
{ max: 54.69, growth: 0.77376565954311 }, 
{ max: 55.1, growth: 0.78624977143902 }, 
{ max: 55.51, growth: 0.798548094373866 }, 
{ max: 55.93, growth: 0.774635200864709 }, 
{ max: 56.35, growth: 0.786697657786519 }, 
{ max: 56.77, growth: 0.798580301685892 }, 
{ max: 57.2, growth: 0.810287123480712 }, 
{ max: 57.63, growth: 0.821678321678322 }, 
{ max: 58.06, growth: 0.832899531494014 }, 
{ max: 58.49, growth: 0.843954529796762 }, 
{ max: 58.93, growth: 0.854846982390152 }, 
{ max: 59.38, growth: 0.865433565246903 }, 
{ max: 59.82, growth: 0.875715729201752 }, 
{ max: 60.27, growth: 0.902708124373119 }, 
{ max: 60.72, growth: 0.912560146009623 }, 
{ max: 61.18, growth: 0.922266139657444 }, 
{ max: 61.64, growth: 0.93167701863354 }, 
{ max: 62.1, growth: 0.940947436729396 }, 
{ max: 62.56, growth: 0.950080515297907 }, 
{ max: 63.03, growth: 0.959079283887468 }, 
{ max: 63.51, growth: 0.967793114389973 }, 
{ max: 63.98, growth: 0.976224216658794 }, 
{ max: 64.46, growth: 0.984682713347921 }, 
{ max: 64.95, growth: 0.992863791498604 }, 
{ max: 65.43, growth: 1.00076982294072 }, 
{ max: 65.92, growth: 1.0087116001834 }, 
{ max: 66.42, growth: 1.01638349514563 }, 
{ max: 66.92, growth: 1.02378801565793 }, 
{ max: 67.42, growth: 1.03108188882247 }, 
{ max: 67.92, growth: 1.03826757638683 }, 
{ max: 68.43, growth: 1.04534746760895 }, 
{ max: 68.95, growth: 1.05217010083297 }, 
{ max: 69.46, growth: 1.05873821609862 }, 
{ max: 69.98, growth: 1.03656780881083 }, 
{ max: 70.51, growth: 1.04315518719634 }, 
{ max: 71.04, growth: 1.04949652531556 }, 
{ max: 71.57, growth: 1.05574324324324 }, 
{ max: 72.11, growth: 1.06189744306274 }, 
{ max: 72.65, growth: 1.0678130633754 }, 
{ max: 73.19, growth: 1.07364074328975 }, 
{ max: 73.74, growth: 1.07938242929362 }, 
{ max: 74.29, growth: 1.0848928668294 }, 
{ max: 74.85, growth: 1.09032171220891 }, 
{ max: 75.41, growth: 1.09552438209753 }, 
{ max: 75.98, growth: 1.10064978119613 }, 
{ max: 76.55, growth: 1.10555409318242 }, 
{ max: 77.12, growth: 1.11038536903984 }, 
{ max: 77.7, growth: 1.11514522821577 }, 
{ max: 78.28, growth: 1.11969111969112 }, 
{ max: 78.87, growth: 1.12416964741952 }, 
{ max: 79.46, growth: 1.12843920375301 }, 
{ max: 80.04, growth: 1.13264535615404 }, 
{ max: 80.66, growth: 1.13693153423288 }, 
{ max: 81.26, growth: 1.14059013141582 }, 
{ max: 81.87, growth: 1.14447452621216 }, 
{ max: 82.49, growth: 1.14816171979968 }, 
{ max: 83.11, growth: 1.15165474602982 }, 
{ max: 83.73, growth: 1.15509565635904 }, 
{ max: 84.36, growth: 1.15848560850352 }, 
{ max: 84.99, growth: 1.16168800379327 }, 
{ max: 85.63, growth: 1.16484292269679 }, 
{ max: 86.27, growth: 1.16781501810113 }, 
{ max: 86.92, growth: 1.17074301611221 }, 
{ max: 87.57, growth: 1.17349286700414 }, 
{ max: 88.23, growth: 1.17620189562636 }, 
{ max: 88.89, growth: 1.17873739091012 }, 
{ max: 89.55, growth: 1.18123523455957 }, 
{ max: 90.23, growth: 1.18369625907314 }, 
{ max: 90.9, growth: 1.18585836196387 }, 
{ max: 91.58, growth: 1.18811881188119 }, 
{ max: 92.27, growth: 1.19021620441144 }, 
{ max: 92.96, growth: 1.19215346266392 }, 
{ max: 93.66, growth: 1.19406196213425 }, 
{ max: 94.36, growth: 1.19581464872945 }, 
{ max: 95.07, growth: 1.19754133107249 }, 
{ max: 95.78, growth: 1.19911644051751 }, 
{ max: 96.5, growth: 1.20066819795364 }, 
{ max: 97.23, growth: 1.2020725388601 }, 
{ max: 97.5, growth: 1.20333230484418 }, 


{ max: 100.75, growth: 0.75 }, 
{ max: 101.51, growth: 0.754342431761787 }, 
{ max: 102.27, growth: 0.7486947098808 }, 
{ max: 103.03, growth: 0.752908966461328 }, 
{ max: 103.81, growth: 0.747355139279822 }, 
{ max: 104.59, growth: 0.751372700125229 }, 
{ max: 105.37, growth: 0.755330337508366 }, 
{ max: 106.16, growth: 0.749739014899877 }, 
{ max: 106.96, growth: 0.753579502637528 }, 
{ max: 107.76, growth: 0.74794315632012 }, 
{ max: 108.57, growth: 0.751670378619154 }, 
{ max: 109.38, growth: 0.746062448190108 }, 
{ max: 110.2, growth: 0.749680014627903 }, 
{ max: 111.03, growth: 0.753176043557169 }, 
{ max: 111.86, growth: 0.756552283166712 }, 
{ max: 112.7, growth: 0.750938673341677 }, 
{ max: 113.54, growth: 0.754214729370009 }, 
{ max: 114.4, growth: 0.74863484234631 }, 
{ max: 115.25, growth: 0.751748251748252 }, 
{ max: 116.12, growth: 0.746203904555315 }, 
{ max: 116.99, growth: 0.749224939717534 }, 
{ max: 117.87, growth: 0.752201042824173 }, 
{ max: 118.75, growth: 0.746585221006193 }, 
{ max: 119.64, growth: 0.749473684210526 }, 
{ max: 120.54, growth: 0.752256770310933 }, 
{ max: 121.44, growth: 0.754936120789779 }, 
{ max: 122.35, growth: 0.749341238471673 }, 
{ max: 123.27, growth: 0.751941152431549 }, 
{ max: 124.2, growth: 0.754441469944025 }, 
{ max: 125.13, growth: 0.748792270531401 }, 
{ max: 126.07, growth: 0.751218732518181 }, 
{ max: 127.01, growth: 0.753549615293091 }, 
{ max: 127.96, growth: 0.747972600582631 }, 
{ max: 128.92, growth: 0.750234448265083 }, 
{ max: 129.89, growth: 0.752404591995036 }, 
{ max: 130.86, growth: 0.746785741781508 }, 
{ max: 131.85, growth: 0.748891945590708 }, 
{ max: 132.83, growth: 0.750853242320819 }, 
{ max: 133.83, growth: 0.752841978468719 }, 
{ max: 134.83, growth: 0.754688784278562 }, 
{ max: 135.85, growth: 0.749091448490692 }, 
{ max: 136.86, growth: 0.750828119249172 }, 
{ max: 137.89, growth: 0.752593891568026 }, 
{ max: 138.93, growth: 0.754224381753572 }, 
{ max: 139.97, growth: 0.748578420787447 }, 
{ max: 141.02, growth: 0.750160748731871 }, 
{ max: 142.07, growth: 0.751666430293575 }, 
{ max: 143.14, growth: 0.753149855704934 }, 
{ max: 144.21, growth: 0.747519910577058 }, 
{ max: 145.3, growth: 0.748907842729353 }, 
{ max: 146.39, growth: 0.750172057811425 }, 
{ max: 147.48, growth: 0.751417446546896 }, 
{ max: 148.59, growth: 0.752644426362897 }, 
{ max: 149.7, growth: 0.747022006864527 }, 
{ max: 150.83, growth: 0.748162992651971 }, 
{ max: 151.96, growth: 0.749187827355301 }, 
{ max: 153.1, growth: 0.750197420373783 }, 
{ max: 154.25, growth: 0.751143043762247 }, 
{ max: 155.4, growth: 0.752025931928687 }, 
{ max: 156.57, growth: 0.752895752895753 }, 
{ max: 157.74, growth: 0.753656511464521 }, 
{ max: 158.93, growth: 0.748066438443008 }, 
{ max: 160.12, growth: 0.748757314540993 }, 
{ max: 161.32, growth: 0.749437921558831 }, 
{ max: 162.53, growth: 0.750061988594099 }, 
{ max: 163.75, growth: 0.75063065280256 }, 
{ max: 164.98, growth: 0.751145038167939 }, 
{ max: 166.21, growth: 0.751606255303673 }, 
{ max: 167.46, growth: 0.752060646170507 }, 
{ max: 168.72, growth: 0.752418487997134 }, 
{ max: 169.98, growth: 0.752726410621148 }, 
{ max: 171.26, growth: 0.747146723143899 }, 
{ max: 172.54, growth: 0.747401611584725 }, 
{ max: 173.83, growth: 0.74765271821027 }, 
{ max: 175.14, growth: 0.747857101766093 }, 
{ max: 176.45, growth: 0.747973050131324 }, 
{ max: 177.77, growth: 0.748087276848966 }, 
{ max: 179.11, growth: 0.748157731900771 }, 
{ max: 180.45, growth: 0.7481435989057 }, 
{ max: 181.8, growth: 0.748129675810474 }, 
{ max: 183.17, growth: 0.748074807480748 }, 
{ max: 184.54, growth: 0.747939072992302 }, 
{ max: 185.93, growth: 0.747805353852823 }, 
{ max: 187.32, growth: 0.747593180229118 }, 
{ max: 188.73, growth: 0.747384155455904 }, 
{ max: 190.14, growth: 0.752397605044243 }, 
{ max: 191.57, growth: 0.75207741664037 }, 
{ max: 193, growth: 0.751683457743906 }, 
{ max: 194.45, growth: 0.751295336787565 }, 
{ max: 195.91, growth: 0.745692980200566 }, 


{ max: 302.25, growth: 0.75 }, 
{ max: 304.52, growth: 0.751033912324235 }, 
{ max: 306.8, growth: 0.748719295941153 }, 
{ max: 309.1, growth: 0.749674054758801 }, 
{ max: 311.42, growth: 0.750566159818829 }, 
{ max: 313.76, growth: 0.751396827435617 }, 
{ max: 316.11, growth: 0.748980112187659 }, 
{ max: 318.48, growth: 0.749739014899877 }, 
{ max: 320.87, growth: 0.750439588043205 }, 
{ max: 323.27, growth: 0.751082993112476 }, 
{ max: 325.7, growth: 0.748600241284375 }, 
{ max: 328.14, growth: 0.749155664722137 }, 
{ max: 330.6, growth: 0.749680014627903 }, 
{ max: 333.08, growth: 0.750151240169389 }, 
{ max: 335.58, growth: 0.750570433529482 }, 
{ max: 338.1, growth: 0.750938673341677 }, 
{ max: 340.63, growth: 0.75125702454895 }, 
{ max: 343.19, growth: 0.748612864398321 }, 
{ max: 345.76, growth: 0.748856318657304 }, 
{ max: 348.36, growth: 0.749074502545118 }, 
{ max: 350.97, growth: 0.749224939717534 }, 
{ max: 353.6, growth: 0.749351796449839 }, 
{ max: 356.25, growth: 0.749434389140271 }, 
{ max: 358.92, growth: 0.749473684210526 }, 
{ max: 361.62, growth: 0.749470634124596 }, 
{ max: 364.33, growth: 0.749405453238206 }, 
{ max: 367.06, growth: 0.74932067082041 }, 
{ max: 369.81, growth: 0.749196316678472 }, 
{ max: 372.59, growth: 0.749033287363781 }, 
{ max: 375.38, growth: 0.748812367481682 }, 
{ max: 378.2, growth: 0.751238744738665 }, 
{ max: 381.03, growth: 0.750925436277102 }, 
{ max: 383.89, growth: 0.750597065847834 }, 
{ max: 386.77, growth: 0.750214905311417 }, 
{ max: 389.67, growth: 0.749799622514673 }, 
{ max: 392.59, growth: 0.749352015808248 }, 
{ max: 395.54, growth: 0.748872869915179 }, 
{ max: 398.5, growth: 0.750872225312231 }, 
{ max: 401.49, growth: 0.750313676286073 }, 
{ max: 404.5, growth: 0.749707340157912 }, 
{ max: 407.54, growth: 0.749072929542645 }, 
{ max: 410.59, growth: 0.750846542670658 }, 
{ max: 413.67, growth: 0.750140042378042 }, 
{ max: 416.78, growth: 0.749389610075664 }, 
{ max: 419.9, growth: 0.750995729161668 }, 
{ max: 423.05, growth: 0.750178613955704 }, 
{ max: 426.22, growth: 0.749320411298901 }, 
{ max: 429.42, growth: 0.750785979071841 }, 
{ max: 432.64, growth: 0.749848633039914 }, 
{ max: 435.89, growth: 0.748890532544379 }, 
{ max: 439.16, growth: 0.750189267934571 }, 
{ max: 442.45, growth: 0.749157482466527 }, 
{ max: 445.77, growth: 0.750367273138208 }, 
{ max: 449.11, growth: 0.74926531619445 }, 
{ max: 452.48, growth: 0.750372959853933 }, 
{ max: 455.87, growth: 0.749204384724187 }, 
{ max: 459.29, growth: 0.750213876763112 }, 
{ max: 462.74, growth: 0.748982124583596 }, 
{ max: 466.21, growth: 0.749881142758352 }, 
{ max: 469.7, growth: 0.750734647476459 }, 
{ max: 473.23, growth: 0.749414519906323 }, 
{ max: 476.78, growth: 0.750163768146567 }, 
{ max: 480.35, growth: 0.750870422417048 }, 
{ max: 483.95, growth: 0.749453523472468 }, 
{ max: 487.58, growth: 0.750077487343734 }, 
{ max: 491.24, growth: 0.750646047828049 }, 
{ max: 494.93, growth: 0.7491246641153 }, 
{ max: 498.64, growth: 0.749600953670216 }, 
{ max: 502.38, growth: 0.750040109096743 }, 
{ max: 506.15, growth: 0.750427962896612 }, 
{ max: 509.94, growth: 0.750765583325101 }, 
{ max: 513.77, growth: 0.749107738165274 }, 
{ max: 517.62, growth: 0.749362555228994 }, 
{ max: 521.5, growth: 0.749584637378772 }, 
{ max: 525.41, growth: 0.749760306807287 }, 
{ max: 529.35, growth: 0.749890561656611 }, 
{ max: 533.32, growth: 0.749976386133938 }, 
{ max: 537.32, growth: 0.750018750468762 }, 
{ max: 541.35, growth: 0.750018610883645 }, 
{ max: 545.41, growth: 0.749976909577907 }, 
{ max: 549.5, growth: 0.749894574723602 }, 
{ max: 553.63, growth: 0.749772520473157 }, 
{ max: 557.78, growth: 0.749598107038997 }, 
{ max: 561.96, growth: 0.749399404783248 }, 
{ max: 566.18, growth: 0.749163641540323 }, 
{ max: 570.42, growth: 0.750644671305945 }, 
{ max: 574.7, growth: 0.750324322429087 }, 
{ max: 579.01, growth: 0.749956499042979 }, 
{ max: 583.35, growth: 0.749555275383845 }, 
{ max: 587.73, growth: 0.750835690408846 }, 


{ max: 503.75, growth: 0.75 }, 
{ max: 507.53, growth: 0.750372208436725 }, 
{ max: 511.33, growth: 0.750694540224223 }, 
{ max: 515.17, growth: 0.750982731308548 }, 
{ max: 519.03, growth: 0.749267232175787 }, 
{ max: 522.93, growth: 0.749474982178294 }, 
{ max: 526.85, growth: 0.74962232038705 }, 
{ max: 530.8, growth: 0.749739014899877 }, 
{ max: 534.78, growth: 0.749811605124341 }, 
{ max: 538.79, growth: 0.749841056135233 }, 
{ max: 542.83, growth: 0.749828319011118 }, 
{ max: 546.9, growth: 0.749774330821804 }, 
{ max: 551.01, growth: 0.749680014627903 }, 
{ max: 555.14, growth: 0.749532676357961 }, 
{ max: 559.3, growth: 0.749360521670209 }, 
{ max: 563.5, growth: 0.749150724119435 }, 
{ max: 567.72, growth: 0.750665483584738 }, 
{ max: 571.98, growth: 0.750369900655253 }, 
{ max: 576.27, growth: 0.750026224693171 }, 
{ max: 580.59, growth: 0.749648602217711 }, 
{ max: 584.95, growth: 0.749237844261872 }, 
{ max: 589.33, growth: 0.750491494999573 }, 
{ max: 593.75, growth: 0.750004242105442 }, 
{ max: 598.21, growth: 0.749473684210526 }, 
{ max: 602.69, growth: 0.750572541415222 }, 
{ max: 607.21, growth: 0.749970963513581 }, 
{ max: 611.77, growth: 0.749328897745426 }, 
{ max: 616.36, growth: 0.750281968713732 }, 
{ max: 620.98, growth: 0.749561944318256 }, 
{ max: 625.64, growth: 0.7504267448227 }, 
{ max: 630.33, growth: 0.749632376446519 }, 
{ max: 635.06, growth: 0.750400583821173 }, 
{ max: 639.82, growth: 0.749535476962807 }, 
{ max: 644.62, growth: 0.750210996842862 }, 
{ max: 649.45, growth: 0.749278644782973 }, 
{ max: 654.32, growth: 0.749865270613596 }, 
{ max: 659.23, growth: 0.750397359090353 }, 
{ max: 664.17, growth: 0.749359100769079 }, 
{ max: 669.16, growth: 0.749808031076381 }, 
{ max: 674.17, growth: 0.750194273417419 }, 
{ max: 679.23, growth: 0.750552531260661 }, 
{ max: 684.32, growth: 0.749377972115484 }, 
{ max: 689.46, growth: 0.749649286883329 }, 
{ max: 694.63, growth: 0.749862211005715 }, 
{ max: 699.84, growth: 0.750039589421707 }, 
{ max: 705.09, growth: 0.75017146776406 }, 
{ max: 710.37, growth: 0.750258832205818 }, 
{ max: 715.7, growth: 0.750313217055901 }, 
{ max: 721.07, growth: 0.750314377532486 }, 
{ max: 726.48, growth: 0.750273898511934 }, 
{ max: 731.93, growth: 0.750192710053959 }, 
{ max: 737.42, growth: 0.750071728170727 }, 
{ max: 742.95, growth: 0.749911854845272 }, 
{ max: 748.52, growth: 0.749713978060435 }, 
{ max: 754.13, growth: 0.74947897183776 }, 
{ max: 759.79, growth: 0.750533727606646 }, 
{ max: 765.49, growth: 0.750207294120744 }, 
{ max: 771.23, growth: 0.749846503546748 }, 
{ max: 777.01, growth: 0.749452173800293 }, 
{ max: 782.84, growth: 0.750312093795447 }, 
{ max: 788.71, growth: 0.749833937969445 }, 
{ max: 794.63, growth: 0.750592740043869 }, 
{ max: 800.59, growth: 0.750034607301511 }, 
{ max: 806.59, growth: 0.749447282629061 }, 
{ max: 812.64, growth: 0.750071287767019 }, 
{ max: 818.74, growth: 0.749409332545777 }, 
{ max: 824.88, growth: 0.749932823607006 }, 
{ max: 831.06, growth: 0.750412181165745 }, 
{ max: 837.3, growth: 0.749645031646331 }, 
{ max: 843.58, growth: 0.750029857876508 }, 
{ max: 849.9, growth: 0.750373408568245 }, 
{ max: 856.28, growth: 0.749499941169549 }, 
{ max: 862.7, growth: 0.749754753118139 }, 
{ max: 869.17, growth: 0.749971021212472 }, 
{ max: 875.69, growth: 0.750140939056801 }, 
{ max: 882.26, growth: 0.750265504916123 }, 
{ max: 888.87, growth: 0.750345703080725 }, 
{ max: 895.54, growth: 0.750390945807598 }, 
{ max: 902.26, growth: 0.750385242423566 }, 
{ max: 909.02, growth: 0.750338040032807 }, 
{ max: 915.84, growth: 0.750258520164573 }, 
{ max: 922.71, growth: 0.750131027253669 }, 
{ max: 929.63, growth: 0.749964777665789 }, 
{ max: 936.6, growth: 0.749760657465874 }, 
{ max: 943.63, growth: 0.749519538757207 }, 
{ max: 950.7, growth: 0.750294077127688 }, 
{ max: 957.83, growth: 0.749973703586831 }, 
{ max: 965.02, growth: 0.74961110009083 }, 
{ max: 972.25, growth: 0.750243518269052 }, 
{ max: 979.55, growth: 0.74980714836719 }, 
];
// ---- Core calc constants & helpers ----

function formatDateISO(d) {
  return new Date(d).toISOString().slice(0, 10);
}
function fmtMoney(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function compoundOnePeriod(a) {
    let rate = DEFAULT_RATE;

    // The Fund 'a' is the starting amount for the period.
    // We iterate from the highest 'max' down to find the most specific rate.
    for (const cap of RATE_CAPS) {
        // The condition 'a < cap.max' finds the first cap that is higher than the current fund.
        // If the array is built from a sequential table, it's more accurate to check
        // if the current amount 'a' is below the next period's ending amount.
        
        // However, based on how the provided data is structured (Profit/Fund = Growth%), 
        // the correct approach is to check if 'a' is close to the starting value for the
        // period defined by 'cap.max'. Since the exact starting values aren't in the array,
        // we use a simplified match based on the 'max' values.

        if (a < cap.max) {
            // Found the specific rate for the current period.
            // Convert the percentage to a decimal rate by dividing by 100.
            rate = cap.growth / 100;
            // console.log(`Capped rate for max ${cap.max}: ${rate * 100}%`);
            break;
        }
    }

    // Calculate the increment and the new fund value.
    const inc = a * rate;
    
    // Return the new fund value, correctly rounded to 2 decimal places.
    return parseFloat((a + inc).toFixed(2));
}
function compoundOneDay(a, initialAmount) {
  const start=new Date(document.getElementById('startDate').value);
  const year = start.getFullYear();
  const month = start.toLocaleString('default', { month: 'short' });
  const day = start.getDate();
  console.log(`\n=== Starting new day ${month} ${day}, ${year} with balance: $${a.toFixed(2)} ===`);

  for (let i = 0; i < COMPOUNDS_PER_DAY; i++) {
    const oldBalance = a;
    a = compoundOnePeriod(a, initialAmount);
    console.log(
      ` Signal ${i + 1}: $${oldBalance.toFixed(2)} → $${a.toFixed(2)}`
    );
  }

  console.log(`End of day balance: $${a.toFixed(2)}\n`);
  return a;
}

function takehome(amount) {
  // Always return rounded 2 decimals
  return parseFloat((amount * (1 - WITHDRAWAL_FEE_RATE)).toFixed(2));
}

// ---- Withdrawal UI helpers ----
function addWithdrawal() {
  const d = document.getElementById("withdrawDate").value;
  const a = parseFloat(document.getElementById("withdrawAmount").value);
  if (!d || isNaN(a) || a <= 0) { alert("Enter valid date & amount"); return; }
  withdrawals.push({ id: Date.now(), date: formatDateISO(d), amount: parseFloat(a.toFixed(2)) });
  withdrawals.sort((x, y) => new Date(x.date) - new Date(y.date));
  renderWithdrawals();
}

async function renderWithdrawals() {
  const list = document.getElementById("withdrawalsList");
  if (!list) return;

  // If no withdrawals, render empty message and hide chart
  if (withdrawals.length === 0) {
    list.innerHTML = '<li class="list-group-item text-muted">No withdrawals</li>';
    updateBalanceChart(); // keep chart state consistent
    return;
  }

  // Ensure we have an exchange rate. Try to fetch if we don't.
  if (!usdToPhp) {
    try {
      const resp = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await resp.json();
      if (data && data.rates && data.rates.PHP) {
        usdToPhp = data.rates.PHP;
      } else {
        usdToPhp = null;
      }
    } catch (err) {
      // network or API error -> keep usdToPhp null and continue (we'll show '—' for PHP)
      console.warn("Failed to fetch USD→PHP rate:", err);
      usdToPhp = null;
    }
  }

  // Build the list HTML
  const html = withdrawals
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(w => {
      const grossUsd = Number(w.amount) || 0;
      const takeHomeUsd = takehome(grossUsd);

      const grossPhp = usdToPhp ? fmtMoney(grossUsd * usdToPhp) : "—";
      const takeHomePhp = usdToPhp ? fmtMoney(takehome(grossUsd * usdToPhp)) : "—";

      return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>$${fmtMoney(grossUsd)}</strong>
            ${ usdToPhp ? `₱${grossPhp}` : "" }
            <span class="text-muted"> (-${Math.round(WITHDRAWAL_FEE_RATE*100)}% Take home: </span>
            <strong>$${fmtMoney(takeHomeUsd)}</strong>
            ${ usdToPhp ? `<span class="text-muted"> ₱${takeHomePhp}</span>` : "" }
            <span class="text-muted">)</span>
            <spa><small class="text-muted">${w.date}</small></spa>
          </div>
          <div>
            <button class="btn btn-sm btn-warning me-2" onclick="editWithdrawal(${w.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteWithdrawal(${w.id})">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");

  list.innerHTML = html;

  // Update chart as before
  updateBalanceChart();
}

function editWithdrawal(id){
  const i=withdrawals.findIndex(w=>w.id===id);
  if(i<0)return;
  const a=prompt("Edit amount",withdrawals[i].amount); if(a===null)return;
  const n=parseFloat(a); if(isNaN(n)||n<=0){alert("Invalid");return;}
  const d=prompt("Edit date YYYY-MM-DD",withdrawals[i].date); if(d===null)return;
  if(isNaN(new Date(d))) {alert("Invalid date");return;}
  withdrawals[i].amount=parseFloat(n.toFixed(2)); withdrawals[i].date=formatDateISO(d);
  withdrawals.sort((x, y) => new Date(x.date) - new Date(y.date));
  renderWithdrawals();
}
function deleteWithdrawal(id){
  withdrawals=withdrawals.filter(w=>w.id!==id);
  renderWithdrawals();
}

// ---- Core calc helpers ----
function applyWithdrawalsForDays(amount,startDate,days){
  const end=new Date(startDate); end.setDate(end.getDate()+days);
  const relevant = withdrawals.filter(w=> new Date(w.date)>=startDate && new Date(w.date)<end)
                              .sort((a,b)=>new Date(a.date)-new Date(b.date));
  let usedDays=0; let a=amount; let cur=new Date(startDate);
  const initialAmount = amount;
  for(const wd of relevant){
    const diff = Math.max(0, Math.ceil((new Date(wd.date)-cur)/msPerDay));
    for(let d=0; d<diff; d++){a=compoundOneDay(a, initialAmount);usedDays++;}
    a = Math.max(0,a - wd.amount);
    cur = new Date(wd.date); cur.setDate(cur.getDate()+1);
  }
  const remain=days-usedDays;
  for(let d=0; d<remain; d++){a=compoundOneDay(a, initialAmount);}
  return a;
}

function growToTarget(amount,startDate,target){
  let a=amount,days=0,cur=new Date(startDate);
  const sorted=[...withdrawals].sort((x,y)=>new Date(x.date)-new Date(y.date));
  let idx=0;
  const initialAmount = amount;
  while(a<target){
    const next=sorted[idx]?new Date(sorted[idx].date):null;
    if(next && next<=cur){ a=Math.max(0,a-sorted[idx].amount); idx++; continue; }
    a=compoundOneDay(a, initialAmount); days++;
    cur.setDate(cur.getDate()+1);
    if(next && cur>next){ a=Math.max(0,a-sorted[idx].amount); idx++; }
    if(days>1000000)break;
  }
  return {amount:a,days,end:cur};
}

// ---- User actions ----
function calculateInvestment(){
  const amount=parseFloat(document.getElementById('startAmount').value);
  const days=parseInt(document.getElementById('days').value);
  const start=new Date(document.getElementById('startDate').value);
  if(isNaN(amount)||isNaN(days)||isNaN(start))return alert('Enter valid inputs');

  const final=applyWithdrawalsForDays(amount,start,days);
  const end=new Date(start); end.setDate(start.getDate()+days);

  const pesoAmount = usdToPhp ? (final * usdToPhp) : null;               // numeric or null
  const pesoText = pesoAmount !== null ? ` ₱${fmtMoney(pesoAmount)}` : ""; // formatted string or empty

  const takeHomeUsd = takehome(final);                                 // numeric
  const takeHomePesoAmount = (pesoAmount !== null) ? takehome(pesoAmount) : null;
  const takeHomePesoText = takeHomePesoAmount !== null ? ` ₱${fmtMoney(takeHomePesoAmount)}` : "";

  document.getElementById('finalResult').textContent =
    `Final amount after ${days} days: $${fmtMoney(final)}${pesoText} ` +
    `(-${Math.round(WITHDRAWAL_FEE_RATE * 100)}% Take home: $${fmtMoney(takeHomeUsd)}${takeHomePesoText})`;

  document.getElementById('finalResult').classList.remove('d-none');
  document.getElementById('endDate').value=formatDateISO(end);
  updateBalanceChart();
}

function calculateDaysToTarget(){
  const amount=parseFloat(document.getElementById('startAmount').value);
  const target=parseFloat(document.getElementById('targetAmount').value);
  const start=new Date(document.getElementById('startDate').value);
  if(isNaN(amount)||isNaN(target)||isNaN(start))return alert('Enter valid inputs');

  const r=growToTarget(amount,start,target);

  let peso = usdToPhp ? " ₱" + fmtMoney(target * usdToPhp) : "";
  document.getElementById('days').value=r.days;
  document.getElementById('endDate').value=formatDateISO(r.end);
  document.getElementById('targetResult').textContent =
  `It will take about ${r.days} days to reach $${fmtMoney(target)} ₱${fmtMoney(target * usdToPhp)} ` +
  `(-${Math.round(WITHDRAWAL_FEE_RATE*100)}% Take home: $${fmtMoney(takehome(target))} ₱${fmtMoney(takehome(target * usdToPhp))}) ` +
  `(until ${r.end.toDateString()}).`;

  document.getElementById('targetResult').classList.remove('d-none');
  updateBalanceChart();
}

// ---- Date link helpers ----
function updateEndDateFromDays(){
  const s=new Date(document.getElementById('startDate').value);
  const d=parseInt(document.getElementById('days').value||0);
  if(!isNaN(d)){s.setDate(s.getDate()+d);document.getElementById('endDate').value=formatDateISO(s);}
}
function updateDaysFromEndDate(){
  const s=new Date(document.getElementById('startDate').value);
  const e=new Date(document.getElementById('endDate').value);
  if(!isNaN(e))document.getElementById('days').value=Math.ceil((e-s)/msPerDay);
}

// ---- Chart for withdrawals ----
function updateBalanceChart() {
  const container = document.getElementById("balanceChartContainer");
  if (!container) return;

  container.classList.remove("d-none");

  let startAmount = parseFloat(document.getElementById("startAmount").value);
  if (isNaN(startAmount)) startAmount = 300;

  const startDate = new Date(document.getElementById("startDate").value);
  const endDateInput = document.getElementById("endDate").value;
  const finalDate = endDateInput ? new Date(endDateInput) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  const msPerDay = 1000 * 60 * 60 * 24;
  const normalize = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const lastDayOfMonth = d => new Date(d.getFullYear(), d.getMonth() + 1, 0);

  const sortedWDs = [...withdrawals].sort((a, b) => new Date(a.date) - new Date(b.date));
  let checkpoints = sortedWDs.map(w => normalize(new Date(w.date)));

  // --- Add month-end checkpoints only if no withdrawal in that month ---
  if (checkpoints.length > 0) {
    const first = checkpoints[0];
    const last = checkpoints[checkpoints.length - 1];
    let monthCursor = new Date(first.getFullYear(), first.getMonth(), 1);

    while (monthCursor <= last) {
      const monthEnd = normalize(lastDayOfMonth(monthCursor));
      const hasWDInMonth = sortedWDs.some(w => {
        const d = new Date(w.date);
        return d.getFullYear() === monthCursor.getFullYear() && d.getMonth() === monthCursor.getMonth();
      });

      if (!checkpoints.some(d => d.getTime() === monthEnd.getTime()) && !hasWDInMonth) {
        checkpoints.push(monthEnd);
      }

      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }
  }

  // Add final date as checkpoint
  checkpoints.push(normalize(finalDate));
  checkpoints = checkpoints.sort((a, b) => a - b);

  // --- Calculate balances and withdrawn ---
  let curAmount = startAmount;
  let curDate = normalize(startDate);
  const labels = [], remainingData = [], withdrawnData = [], remainingColors = [];

  for (let chk of checkpoints) {
    const daysDiff = Math.ceil((chk - curDate) / msPerDay);
  const initialAmount = startAmount;
  for (let i = 0; i < daysDiff; i++) curAmount = compoundOneDay(curAmount, initialAmount);

    // Withdrawal if any
    const wd = sortedWDs.find(w => normalize(new Date(w.date)).getTime() === chk.getTime());
    let wdAmount = 0;
    if (wd) {
      wdAmount = wd.amount;
      curAmount = Math.max(0, curAmount - wdAmount);
    }

    // Skip month-end checkpoint if it’s zero and a withdrawal exists in same month
    const isMonthEnd = chk.getDate() === lastDayOfMonth(chk).getDate();
    const hasWDInMonth = sortedWDs.some(w => {
      const d = new Date(w.date);
      return d.getFullYear() === chk.getFullYear() && d.getMonth() === chk.getMonth();
    });
    if (isMonthEnd && wdAmount === 0 && hasWDInMonth) continue;

    labels.push(`${formatDateISO(chk)}${wdAmount > 0 ? ` (WD $${fmtMoney(wdAmount)})` : ""}`);
    withdrawnData.push(wdAmount);
    remainingData.push(curAmount.toFixed(2));
    remainingColors.push(!wd && chk.getTime() === normalize(finalDate).getTime() ? "#87CEFA" : "#0d6efd");

    curDate = new Date(chk.getTime() + msPerDay);
  }

  if (balanceChart) balanceChart.destroy();
  const ctx = document.getElementById("balanceChart").getContext("2d");
  balanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Remaining Balance", data: remainingData, backgroundColor: remainingColors, stack: 'stack1' },
        { label: "Withdrawn", data: withdrawnData, backgroundColor: "#dc3545", stack: 'stack1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: { font: { size: 10 } }, barThickness: 16 },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: "Amount ($)" } }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': $' + fmtMoney(ctx.parsed.y);
            }
          }
        }
      }
    }
  });
}

// ---- Fetch USD to PHP rate ----
async function fetchUsdToPhp() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    usdToPhp = data.rates.PHP;
  } catch (e) {
    console.error("Failed to fetch exchange rate", e);
    usdToPhp = 0;
  }
}

// ---- Withdrawal helpers ----
function calculateTakeHome(amountUsd) {
  const grossUsd = Number(amountUsd) || 0;
  const takeHomeUsd = parseFloat((grossUsd * (1 - WITHDRAWAL_FEE_RATE)).toFixed(2));

  const grossPhp = usdToPhp ? fmtMoney(grossUsd * usdToPhp) : "—";
  const takeHomePhp = usdToPhp ? fmtMoney(takeHomeUsd * usdToPhp) : "—";

  return {
    grossUsd,
    takeHomeUsd,
    grossPhp,
    takeHomePhp
  };
}
// ---- init ----
window.onload= async () =>{
  const t=new Date(), ts=formatDateISO(t);
  document.getElementById('startDate').value=ts;
  await fetchUsdToPhp();
  renderWithdrawals();
};
