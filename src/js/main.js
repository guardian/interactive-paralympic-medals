import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import share from './lib/share'

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1bZnrqdBqM1jFuC-iBpOV-_lC8eE2uwb1g1Z3FTy6UJA.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => initData(resp)
    });

    [].slice.apply(el.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}


function initData(resp){

    var data = resp.sheets.Sheet1;
    var timestamp = resp.sheets.Sheet2[0]["Last updated"];
   
    
//     scale = d3.scaleSqrt()
// .domain([0, maxMedalCount])
// .range([0,8]);


    var i, htmlString = '', countryId, goldTotal, silverTotal, bronzeTotal, medalTotal, minMedalCount = 0, maxMedalCount = 0, maxScale = 8, goldScale, silverScale, bronzeScale, position, lastSortTotal = 99999999999999, char0, char1, char2, charCorrect;

    for (var i = 0; i < data.length; i++) {

        goldTotal = parseInt(data[i].gold);
        silverTotal = parseInt(data[i].silver);
        bronzeTotal = parseInt(data[i].bronze);


        data[i].sortTotal = (bronzeTotal*1000000) + (silverTotal * 1000000000) + (goldTotal * 1000000000000);
        //data[i].sortTotal = bronzeTotal + (silverTotal * 1000) + (goldTotal * 1000000);

        char0 = data[i].iso.charCodeAt(0) - 65;
        char1 = data[i].iso.charCodeAt(1) - 65;
        char2 = data[i].iso.charCodeAt(2) - 65;

        charCorrect = (char0 * 10000) + (char1 * 100) + char2;

        data[i].positionTotal = data[i].sortTotal;

        data[i].sortTotal += (1000000 - charCorrect);

        //console.log((10000 - ((char0 * 100) + (char1 * 10) + char2)));


        if ( goldTotal > maxMedalCount ) {
            maxMedalCount = goldTotal;
        }

        if ( silverTotal > maxMedalCount ) {
            maxMedalCount = silverTotal;
        }

         if ( bronzeTotal > maxMedalCount ) {
            maxMedalCount = bronzeTotal;
        }

    }

    function compare(a,b) {
  if (a.sortTotal < b.sortTotal)
    return 1;
  if (a.sortTotal > b.sortTotal)
    return -1;
  return 0;
}

data.sort(compare);

position = 0;

    for (i = 0; i < data.length; i++) {

        countryId = data[i].iso;
        goldTotal = parseInt(data[i].gold);
        silverTotal = parseInt(data[i].silver);
        bronzeTotal = parseInt(data[i].bronze);
        medalTotal = goldTotal + silverTotal + bronzeTotal;

        goldScale = Math.sqrt(goldTotal / maxMedalCount) * maxScale;
        silverScale = Math.sqrt(silverTotal / maxMedalCount) * maxScale;
        bronzeScale = Math.sqrt(bronzeTotal / maxMedalCount) * maxScale;


        if (isNaN(goldScale)) {
            goldScale = 0;
        }

        if (isNaN(silverScale)) {
            silverScale = 0;
        }

        if (isNaN(bronzeScale)) {
            bronzeScale = 0;
        }

        if ( data[i].positionTotal < lastSortTotal) {
            position ++;
            lastSortTotal = data[i].positiontTotal;
        }

        // console.log(data[i].sortTotal);

        htmlString += '<li class="om-table-row" data-id="' + countryId + '" data-position="' + position + '">';
        htmlString += '<div class="om-table-left-area">';
        htmlString += '<span class="om-table-row__position">' + position + '.</span>';
        htmlString += '<span class="om-table-row__flag om-flag om-flag--' + countryId + '"></span>';
        htmlString += '<span class="om-table-row__country">' + countryId + '</span>';
        htmlString += '</div>';
        htmlString += '<div class="om-table-row__medal om-table-row-medal__first">';
        htmlString += '<div class="om-medal-white" style="transform: scale(' + (goldScale + 1) + ');-ms-transform: scale(' + (goldScale + 1) + ');-webkit-transform: scale(' + (goldScale + 1) + ');-moz-transform: scale(' + (goldScale + 1) + '), "></div>';
        htmlString += '<div class="om-medal-circle om-medal-circle--gold" style="transform: scale(' + goldScale + ');-ms-transform: scale(' + goldScale + ');-webkit-transform: scale(' + goldScale + ');-moz-transform: scale(' + goldScale + ')"></div>';
        htmlString += '<span class="om-medal-label" data-count="' + goldTotal + '">' + goldTotal + '</span>';
        htmlString += '</div>';
        htmlString += '<div class="om-table-row__medal">';
        htmlString += '<div class="om-medal-white" style="transform: scale(' + (silverScale + 1) + ');-ms-transform: scale(' + (silverScale + 1) + ');-webkit-transform: scale(' + (silverScale + 1) + ');-moz-transform: scale(' + (silverScale + 1) + ')"></div>';
        htmlString += '<div class="om-medal-circle om-medal-circle--silver" style="transform: scale(' + silverScale + ');-ms-transform: scale(' + silverScale + ');-webkit-transform: scale(' + silverScale + ');-moz-transform: scale(' + silverScale + ')"></div>';
        htmlString += '<span class="om-medal-label" data-count="' + silverTotal + '">' + silverTotal + '</span>';
        htmlString += '</div>';
        htmlString += '<div class="om-table-row__medal">';
        htmlString += '<div class="om-medal-white" style="transform: scale(' + (bronzeScale + 1) + ');-ms-transform: scale(' + (bronzeScale + 1) + ');-webkit-transform: scale(' + (bronzeScale + 1) + ');-moz-transform: scale(' + (bronzeScale + 1) + ')"></div>';
        htmlString += '<div class="om-medal-circle om-medal-circle--bronze" style="transform: scale(' + bronzeScale + ');-ms-transform: scale(' + bronzeScale + ');-webkit-transform: scale(' + bronzeScale + ');-moz-transform: scale(' + bronzeScale + ')"></div>';
        htmlString += '<span class="om-medal-label" data-count="' + bronzeTotal + '">' + bronzeTotal + '</span>';
        htmlString += '</div>';
        htmlString += '<div class="om-table-row__total">' + medalTotal + '</div>';
        htmlString += '</li>';

    }

    var medalTable = document.getElementById("pm-table");
    medalTable.innerHTML = htmlString;

    var timeStampEl = document.getElementById("om-timestamp");
    timeStampEl.innerHTML = timestamp;




}
