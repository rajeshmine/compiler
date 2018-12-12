let formdata = new FormData();
let code, input, lang, inputRadio = 'false', javacode, pythoncode, htmlcode;
javacode = `
<textarea rows="4" cols="50" name="code" id="code">
    import java.io.*;
    import java.math.*;
    import java.security.*;
    import java.text.*;
    import java.util.*;
    import java.util.concurrent.*;
    import java.util.regex.*;
    //Don't change the Class Name 
    public class Main {

        public static void main(String[] args) {

            int num = 29;
            boolean flag = false;
            for(int i = 2; i <= num/2; ++i)
            {
                // condition for nonprime number
                if(num % i == 0)
                {
                    flag = true;
                    break;
                }
            }

            if (!flag)
                System.out.println(num + " is a prime number.");
            else
                System.out.println(num + " is not a prime number.");
        }
    }
</textarea>
`;
pythoncode = `
<textarea rows="4" cols="50" name="code" id="code">
print('Hello, world!');
</textarea>
`;
htmlcode = `
<textarea rows="4" cols="50" name="code" id="code">
<!DOCTYPE html>
<html>
    <title>HTML Tutorial</title>
    <body>

        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>

    </body>
</html>
</textarea>
`;
$(document).ready(function () {
    $('.codeouterdiv').empty();
    $('.codeouterdiv').append(javacode);
    CodeMirrorInit('text/x-java');
    $('#inputdiv,#outputscreen,.settingsdiv').hide();
    $('#inputRadio').change(function () {
        if ($(this).prop("checked")) {
            inputRadio = 'true';
            $('#inputdiv').show();
        }else{
            inputRadio = 'false';
            $('#inputdiv').hide();
        }
    });
    // $('.inputRadio').each(function () {
    //     $(this).click(function () {
    //         if ($(this).val() === 'true') {
    //             inputRadio = 'true';
    //             $('#input').show();
    //         } else {
    //             inputRadio = 'false';
    //             $('#input').hide();
    //         }
    //     });
    // });
    $('#languageselect').change(function () {
        if ($(this).val() === 'Web') {
            $('#previewTarget').css("background","#fff");
            inputoutputscreenreset();
            $('#inputRadiocolumn').hide();
            $('.codeouterdiv').empty();
            $('.codeouterdiv').append(htmlcode);
            CodeMirrorInit('text/html');
        } else if ($(this).val() === 'Python') {
            $('#previewTarget').css("background","#000");
            inputoutputscreenreset();
            $('#inputRadiocolumn').show();
            $('.codeouterdiv').empty();
            $('.codeouterdiv').append(pythoncode);
            CodeMirrorInit('text/x-python');
        } else if ($(this).val() === 'Java') {
            $('#previewTarget').css("background","#000");
            inputoutputscreenreset();
            $('#inputRadiocolumn').show();
            $('.codeouterdiv').empty();
            $('.codeouterdiv').append(javacode);
            CodeMirrorInit('text/x-java');
        }
    });

    $('.CodeMirror').keyup(function () {
        updateTextArea();
    });
});
function compilecode() {
    let url = `/compilecode`;
    code = $('#code').val();
    lang = $('#languageselect').val();
    console.log(code);
    input = $('#input').val();
    if (lang !== '') {
        if (lang === 'Web') {
            $('#outputscreen').show();
            var targetp = $("#previewTarget")[0].contentWindow.document;
            targetp.open();
            targetp.close();
            $('body', targetp).append(code);
        } else {
            formdata.delete("lang");
            formdata.append('lang', lang);
            if (code !== '') {
                formdata.delete("code");
                formdata.append('code', code);
                if (inputRadio === 'true') {
                    formdata.delete("inputRadio");
                    formdata.append('inputRadio', inputRadio);
                    if (input !== '') {
                        formdata.delete("input");
                        formdata.append('input', input);
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: formdata,
                            cache: false,
                            contentType: false,
                            processData: false
                        }).done(data => {
                            if (data.output) {
                                $('#outputscreen').show();
                                var targetp = $("#previewTarget")[0].contentWindow.document;
                                targetp.open();
                                targetp.close();
                                $('body', targetp).append(`<b><pre style="color:#66ff00;">${data.output}</pre></b>`);
                            }
                            if (data.error) {
                                $('#outputscreen').show();
                                var targetp = $("#previewTarget")[0].contentWindow.document;
                                targetp.open();
                                targetp.close();
                                $('body', targetp).append(`<b><pre style="color:#F44336;">${data.error}</pre></b>`);
                            }
                        }).catch(e => {
                            alert(`URL : ${url}\nStatusCode:${e.status}\nDescription:${e.statusText}`);
                        });
                    } else {
                        alert('Input Should not Empty!!!')
                    }
                } else {
                    formdata.delete("inputRadio");
                    formdata.append('inputRadio', inputRadio);
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: formdata,
                        cache: false,
                        contentType: false,
                        processData: false
                    }).done(data => {
                        if (data.output) {
                            $('#outputscreen').show();
                            var targetp = $("#previewTarget")[0].contentWindow.document;
                            targetp.open();
                            targetp.close();
                            $('body', targetp).append(`<b><pre style="color:#66ff00;">${data.output}</pre></b>`);
                        }
                        if (data.error) {
                            $('#outputscreen').show();
                            console.log(data.error)
                            var targetp = $("#previewTarget")[0].contentWindow.document;
                            targetp.open();
                            targetp.close();
                            $('body', targetp).append(`<b><pre style="color:#F44336;">${data.error}</pre></b>`);
                        }
                    }).catch(e => {
                        alert(`URL : ${url}\nStatusCode:${e.status}\nDescription:${e.statusText}`);
                    });
                }
            } else {
                alert('Code Field Empty');
            }
        }
    } else {
        alert('Select Language');
    }
}
var editableCodeMirror;
function CodeMirrorInit(language) {
    editableCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: language,
        lineNumbers: true,
        styleSelectedText: true,
        lineWrapping: true,
        styleActiveLine: true,
        styleActiveSelected: true,
    });
    // if (language === 'text/x-java') {
    //     javareadonly();
    // }
}

// function javareadonly() {
//     var readOnlyLines = [0, 1, 2, 3, 4, 5, 6, 7, 8];
//     readOnlyLines.map((LineNo) => {
//         editableCodeMirror.addLineClass(LineNo, 'background', 'styled-background');
//     });
//     editableCodeMirror.on('beforeChange', function (cm, change) {
//         if (~readOnlyLines.indexOf(change.from.line)) {
//             change.cancel();
//         }
//     });
// }


function updateTextArea() {
    editableCodeMirror.save();
}

$(document).ready(function () {
    $('.themebtn').each(function () {
        $(this).click(function () {
            $('.themebtn').removeClass('themeselected');
            $(this).addClass('themeselected');
            selectTheme($(this).val());
        });
    });
});
function selectTheme(theme) {
    editableCodeMirror.setOption("theme", theme);
}
function settingsdivtoggle() {
    $('.settingsdiv').toggle();
}
function inputoutputscreenreset() {
    $('#input').val('');
    $("#inputRadio").prop('checked', false);
    inputRadio = 'false';
    var targetp = $("#previewTarget")[0].contentWindow.document;
    targetp.open();
    targetp.close();
    $('body', targetp).append('');
    $('#inputdiv,#outputscreen,.settingsdiv').hide();
}