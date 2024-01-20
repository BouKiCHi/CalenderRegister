// 次の日付のdayjsインスタンスを作成
function createNextDateDayJsInstance() {
    let dj = dayjs();
    dj = dj.date(dj.date()+1);
    dj = dj.minute(0);
    return dj;
}

// URLからの情報を設定
function setDataFromUrlParams() {
    const params = new URLSearchParams(location.search);
    for(const key of ['title', 'details', 'start-date', 'end-date']) {
        const value = params.get(key);
        if (!value) continue;
        document.getElementById(key).value = value;
    }

    // 終日
    const checked = Number(params.get('allday'));
    if (checked) {
        $('#allday').prop('checked',true);
    }
}

$(function() {
    // ピッカーの設定
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $(".picker").datetimepicker();

    // URLからの情報の設定
    setDataFromUrlParams();

    // 次の日
    const dj = createNextDateDayJsInstance();
    const startDateTime = dj.format('YYYY/MM/DD HH:mm');

    // const dj2 = dj.hour(dj.hour()+1);
    // const endDateTime = dj2.format('YYYY/MM/DD HH:mm');

    // 開始日時
    const startDate = $('#start-date');
    if (!startDate.val()) startDate.val(startDateTime);
});

// 日付パラメータを作成する
function createDatesParams(allDay, st, ed) {
    const stdj = dayjs(st, 'YYYY/MM/DD HH:mm');
    const eddj = ed ? dayjs(ed, 'YYYY/MM/DD HH:mm') : stdj.hour(stdj.hour()+1);

    // 日時指定
    if (!allDay) {
        const startDate = stdj.format('YYYYMMDD');
        const startTime = stdj.format('HHmm');
        const endDate = eddj.format('YYYYMMDD');
        const endTime = eddj.format('HHmm');
        return `${startDate}T${startTime}/${endDate}T${endTime}`;
    }

    // 終日の場合は日付のみになる
    const startDate = stdj.format('YYYYMMDD');
    const eddj2 = eddj.date(eddj.date()+1);
    const endDate = eddj2.format('YYYYMMDD');
    return `${startDate}/${endDate}`;
}

// GoogleカレンダーURLを作成
function generateGoogleCalendarUrl() {
    const title = $('#title').val();
    if (!title) {
        alert('タイトルは必須です');
        return;
    }
    const details = $('#details').val();
    const st = $('#start-date').val();
    const ed = $('#end-date').val();
    console.log(st);
    console.log(ed);
    const allDay = $('#allday').prop('checked');

    const dates = createDatesParams(allDay, st, ed);

    const params = new URLSearchParams();
    params.append("action", "TEMPLATE");
    params.append("dates", dates);
    params.append("text", title);

    if (details) {
        params.append("details", details);
    }
    const query = params.toString();
    return 'https://www.google.com/calendar/render?' + query;
}

// パラメータを作成
function createCurrentUrlWithParams() {
    const params = new URLSearchParams();
    for(const key of ['title', 'details', 'start-date', 'end-date']) {
        const value = document.getElementById(key).value;
        if (!value) continue;
        params.append(key, value);
    }

    const allDay = $('#allday').prop('checked');
    if (allDay) {
        params.append('allday', '1');
    }

    const url = window.location.href.split('?')[0];
    return url + '?' + params.toString();
}

function copyText(text) {
    if (!navigator.clipboard) {
        alert('クリップボードに未対応です');
        return;
    }

    navigator.clipboard.writeText(text).then(function () { 
        alert('クリップボードにコピーしました。');
    });
}

function copyCurrentUrl() {
    const url = createCurrentUrlWithParams();
    copyText(url);
}

function openCurrentUrl() {
    const url = createCurrentUrlWithParams();
    window.open(url);
}

function openGoogleUrl() {
    const url = generateGoogleCalendarUrl();
    window.open(url);
}

function copyGoogleUrl() {
    const url = generateGoogleCalendarUrl();
    copyText(url);
}