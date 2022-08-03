function checkSubmit() {
    // 检查输入数据的合规性
    let value = document.forms["search"]["searchbar"].value;

    let spacePattern = /\s+/g;
    let NotHanziPattern = /[0-9 a-z]/ig;

    if (value == null || value.length != 1 || NotHanziPattern.test(value) || spacePattern.test(value)) {
        try {
            document.getElementById("invalid-data-prompt").style.visibility = "visible";
        } catch {
            alert("一次只能查询一个汉字（不能有非汉字字符，包括空格、制表符等）");
        }

        return false;
    }

    return true;
}


function searchChar(char) {
    // 请求 API 数据
    $.ajax({
        url: "http://api.jisuapi.com/zidian/word",
        type: "GET",

        data: {
            "appkey": "631c5a5b9992bd74",
            "word": char
        },
        dataType: "jsonp",

        success: function (data) {
            let charInfo = data.result;

            document.getElementById("char").innerHTML = charInfo.name;
            document.getElementById("pinyin").innerHTML = charInfo.pinyin
            document.getElementById("bushou").innerHTML = charInfo.bushou;
            document.getElementById("jiegou").innerHTML = charInfo.jiegou;
            document.getElementById("bihua").innerHTML = charInfo.bihua;
            document.getElementById("wubi").innerHTML = charInfo.wubi;
            document.getElementById("english").innerHTML = charInfo.english;
            document.getElementById("bishun").innerHTML = charInfo.bishun;

            $(".all-explanation").remove();

            for (i in charInfo.explain) {
                let contentLayer = document.createElement("div");
                contentLayer.className = "explanation-layer";

                let line = document.createElement("hr");

                let pinyin = document.createElement("p");
                pinyin.className = "explanation-pinyin";
                pinyin.innerHTML = charInfo.explain[i].pinyin;

                let explanation = document.createElement("p");
                explanation.className = "explanation";
                explanation.innerHTML = charInfo.explain[i].content.replace("\n", "");

                contentLayer.appendChild(pinyin);
                contentLayer.appendChild(line);
                contentLayer.appendChild(explanation);

                let layer = document.createElement("div")
                layer.className = "all-explanation";

                layer.appendChild(contentLayer);

                document.body.appendChild(layer);
            }
        },

        error: function (msg) {
            console.log(msg);
        }
    })
}


function getQueryVariable(variable) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}


if (window.location.href.search("searchbar")) {
    let char = getQueryVariable("searchbar");
    // console.log(char);
    searchChar(char);
}


$(function () {
    $("form[name=search]").submit(function () {
        let word = document.forms["search"]["searchbar"].value;

        if (checkSubmit()) {
            try {
                searchChar(word);
            } catch {
                alert("查询时出现错误");
            }

        }
    });
});