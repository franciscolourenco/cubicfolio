var Page_ESValidationVer = "1";
var Page_IsValid = true;
var Show_Alert = false;
var Msg_Alert = "";
var Page_BlockSubmit = false;

function ValidatorUpdateDisplay(val) {
    if (typeof(val.display) == "string") {
        if (val.display == "None") {
            return;
        }
        if (val.display == "Dynamic") {
            val.style.display = val.isvalid ? "none" : "inline";
            return;
        }
    }
    val.style.visibility = val.isvalid ? "hidden" : "visible";
    if (typeof(val.Masters) != "undefined") {
        var i;
        for (i = 0; i < val.Masters.length; i++) {
            var controlMaster = val.Masters[i];
            if (typeof(controlMaster) != "undefined") {
                var j;
                for (j = 0; j < controlMaster.Validators.length; j++) {
                    if (!controlMaster.Validators[j].isvalid) {
                        controlMaster.innerHTML = controlMaster.Validators[j].getAttribute("messagetomaster");
                        controlMaster.isvalid = false;
                        controlMaster.style.visibility = "visible";
                        return;
                    }
                    else {
                        controlMaster.innerHTML = "";
                        controlMaster.isvalid = true;
                        controlMaster.style.visibility = "hidden";
                    }
                }
            }
        }
    }
}

function ValidationSummary() {
    if (typeof(Page_ValidationSummaries) == "undefined")
        return;

    var val;
    val = Page_ValidationSummaries[1];
    val.innerHTML = "Algunas preguntas por validar";
}

function MasterValidatorUpdate(val) {
    if (typeof(val.Masters) != "undefined") {
        var i;
        for (i = 0; i < val.Masters.length; i++) {
            var controlMaster = val.Masters[i];
            if (controlMaster.isvalid) {
                 controlMaster.isvalid = val.isvalid;
                 if (!controlMaster.isvalid) {
                    controlMaster.innerHTML = val.getAttribute("messagetomaster");
                    controlMaster.isvalid = false;
                    controlMaster.style.visibility = "visible";
                 }
            }
        }
    }

    if (typeof(val.Resumes) != "undefined") {
        var i;
        for (i = 0; i < val.Resumes.length; i++) {
            var controlResume = val.Resumes[i];
            if (typeof(controlResume) != "undefined") {
                var j;
                for (j = 0; j < controlResume.Validators.length; j++) {
                    if (!controlResume.Validators[j].isvalid) {
                        if (controlResume.ShowAlert && !val.isvalid) {
                            Show_Alert = true;
                            Msg_Alert = val.innerHTML;
                        }
                        else {
                            controlResume.innerHTML = val.innerHTML;
                            controlResume.style.visibility = "visible";
                        }
                        controlResume.isvalid = false;
                        return;
                    }
                    else {
                        controlResume.innerHTML = "";
                        controlResume.isvalid = true;
                        controlResume.style.visibility = "hidden";
                    }
                }
            }
        }
    }


}

function ValidatorUpdateIsValid() {
    var i;
    for (i = 0; i < Page_Validators.length; i++) {
        if (!Page_Validators[i].isvalid) {
            Page_IsValid = false;
            return;
        }
   }
   Page_IsValid = true;
}

function ValidatorHookupControl(control, val) {
    if (typeof(control.Validators) == "undefined") {
        control.Validators = new Array;
    }
    control.Validators[control.Validators.length] = val;
}

function ValidatorHookupMasterControl(MasterValControl, val) {
    if (typeof(val.Masters) == "undefined") {
        val.Masters = new Array;
    }
    val.Masters[val.Masters.length] = MasterValControl;
    if (typeof(MasterValControl.Validators) == "undefined") {
        MasterValControl.Validators = new Array;
    }
    MasterValControl.Validators[MasterValControl.Validators.length] = val;
}

function ValidatorHookupResumeControl(ResumeValControl, val) {
    if (typeof(val.Resumes) == "undefined") {
        val.Resumes = new Array;
    }
    var ShowAlertAttribute = ResumeValControl.getAttribute("ShowAlert");
    if (typeof(ShowAlertAttribute) == "string") {
        if (ShowAlertAttribute == "False") {
            ResumeValControl.ShowAlert = false;
        }
        else {
            ResumeValControl.ShowAlert = true;
        }
    } else {
        ResumeValControl.ShowAlert = false;
    }
    val.Resumes[val.Resumes.length] = ResumeValControl;
    if (typeof(ResumeValControl.Validators) == "undefined") {
        ResumeValControl.Validators = new Array;
    }
    ResumeValControl.Validators[ResumeValControl.Validators.length] = val;
}

function ValidatorGetValue(id) {
    var Tipo = "";
    var control;
    control = document.getElementById(id);
    if (typeof(control.value) == "string") {
        return control.value;
    }
    if (control.tagName == "TABLE") {
        var Lista = control.getElementsByTagName("INPUT");
        var i;
        var resultado = "";
        for (i=0; i < Lista.length; i++) {
            var ctrlLista = Lista[i];
            if (Lista[i].type == "checkbox") {
                Tipo = "checkbox";
                if (Lista[i].checked) {
                    resultado = Lista[i].value;
                }
            }
            else {
                Tipo = "";
            }
        }
        if (Tipo == "checkbox") {
            if (resultado == "") {
                resultado = "-1";
            }
            return resultado;
        }
        Lista = document.getElementsByName(id);
        var resultado = "";
        for (i=0; i < Lista.length; i++) {
            var ctrlLista = Lista[i];
            if (Lista[i].type == "radio") {
                Tipo = "radio";
                if (Lista[i].checked) {
                    resultado = Lista[i].value;
                }
            }
            else {
                Tipo = "";
            }
        }
        if (Tipo == "radio") {
            if (resultado == "") {
                resultado = "-1";
            }
            return resultado;
        }
    }
    if (typeof(control.tagName) == "undefined" && typeof(control.length) == "number") {
        var j;
        for (j=0; j < control.length; j++) {
            var inner = control[j];
            if (typeof(inner.value) == "string" && (inner.type != "radio" || inner.status == true)) {
                return inner.value;
            }
        }
    }
    return "";
}

function Page_ClientValidate() {
    Show_Alert = false;
    Msg_Alert = "";
    var i;
    for (i = 0; i < Page_Validators.length; i++) {
        ValidatorValidate(Page_Validators[i]);
    }
    for (i = 0; i < Page_Validators.length; i++) {
        MasterValidatorUpdate(Page_Validators[i]);
    }
    ValidatorUpdateIsValid();
    Page_BlockSubmit = !Page_IsValid;
    return Page_IsValid;
}

function ValidatorCommonOnSubmit() {
    var returnValue = !Page_BlockSubmit;
    if (Show_Alert){
        alert(Msg_Alert);
    }
    Page_BlockSubmit = false;
    return returnValue;
}

function ValidatorOnChange(controlID) {
    var cont = document.getElementById(controlID);
    var vals = cont.Validators;
    var i;
    for (i = 0; i < vals.length; i++) {
        ValidatorValidate(vals[i]);
    }
    ValidatorUpdateIsValid();
}

function ValidatorOnClick(controlID) {
    if (window.navigator.appName.toLowerCase().indexOf("microsoft") > -1) {
        var cont = document.getElementById(controlID);
        var vals = cont.Validators;
        var i;
        for (i = 0; i < vals.length; i++) {
            ValidatorValidate(vals[i]);
        }
        ValidatorUpdateIsValid();
    }
}

function ValidatorValidate(val) {
    val.isvalid = true;
    if (typeof(val.evalfunc) == "function") {
        val.isvalid = val.evalfunc(val);
    }
    ValidatorUpdateDisplay(val);
}

function ValidatorOnLoad() {
    if (typeof(Page_Validators) == "undefined")
        return;

    var i, val;
    for (i = 0; i < Page_Validators.length; i++) {
        val = Page_Validators[i];
        var evalFunction = val.getAttribute("evaluationfunction");
        if (typeof(evalFunction) == "string") {
            eval("val.evalfunc = " + evalFunction + ";");
        }
        var isValidAttribute = val.getAttribute("isvalid");
        if (typeof(isValidAttribute) == "string") {
            if (isValidAttribute == "False") {
                val.isvalid = false;
                Page_IsValid = false;
            }
            else {
                val.isvalid = true;
            }
        } else {
            val.isvalid = true;
        }
        var controlToValidate = val.getAttribute("controltovalidate");
        if (typeof(controlToValidate) == "string") {
            ValidatorHookupControl(document.getElementById(controlToValidate), val);
        }
        var masterValidatorControl = val.getAttribute("mastervalidatorcontrol");
        if (typeof(masterValidatorControl) == "string") {
            ValidatorHookupMasterControl(document.getElementById(masterValidatorControl), val);
        }
        var ResumeValidatorControl = val.getAttribute("Resumevalidatorcontrol");
        if (typeof(ResumeValidatorControl) == "string") {
            ValidatorHookupResumeControl(document.getElementById(ResumeValidatorControl), val);
        }
    }
    Page_ValidationActive = true;
}

function RegularExpressionValidatorEvaluateIsValid(val) {
    var value = ValidatorGetValue(val.getAttribute("controltovalidate"));
    if (value == "")
        return true;
    var rx = new RegExp(val.getAttribute("validationexpression"));
    var matches = rx.exec(value);
    return (matches != null && value == matches[0]);
}

function LTrim (value) {
	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");
}

function RTrim (value) {
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
}

function trim (value) {
	return LTrim(RTrim(value));
}

function ValidatorTrim(s) {
    return trim(s);
}

function RequiredFieldValidatorEvaluateIsValid(val) {
    return (ValidatorTrim(ValidatorGetValue(val.getAttribute("controltovalidate"))) != ValidatorTrim(val.getAttribute("initialvalue")));
}

