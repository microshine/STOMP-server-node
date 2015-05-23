function Frame() {
    this.name;
    this.headers = {};
    this.body = "";
}

Frame.parse = function (text) {
    if (typeof text !== "string")
        throw new TypeError("Parameter 1 msut be String");

    var i = 0;

    //Split command
    var lines = text.split("\n");
    console.log(lines);

    //Get COMMAND
    var fn = lines[i];
    var regFN = /^[A-Z]+$/;
    var frame = new Frame();
    if (!regFN.test(fn))
        throw new Error("Frame has wrong command name (" + fn + ")");
    frame.name = fn;
    
    //Get headers
    var regH = /([\w\-]+):(.+)/;
    frame.headers = {}
    var header;
    while (header = regH.exec(lines[++i])) {
        frame.headers[header[1]] = header[2];
    }

    //check new line
    if (lines[i] !== "")
        throw new Error("Wrong frame format. Needs null new line after headers");

    //Get body
    var end, msg = "";
    var j = i+1;
    while (!end && i < lines.length) {
        var row = lines[++i];
        if (j !== i)
            msg += "\n";
        if (row.charCodeAt(row.length-1) == 0) {
            end = true;
            row = row.slice(0, row.length - 1);
        }
        msg += row;
    }
    if (!end)
        throw new Error("Wrong frame format. Null byte is missing");
    frame.body = msg;

    return frame;
}

Frame.stringify = function (frame) {
    if (!(frame instanceof Frame))
        throw new TypeError("Parameter 1 must be Command");

    var msg = "";

    //add command name
    msg += frame.name + "\n";
   
    //add headers
    for (var i in frame.headers)
        msg += i + ":" + frame.headers[i] + "\n";
    msg += "\n";
    msg += frame.body + "\u0000";

    return msg;
}