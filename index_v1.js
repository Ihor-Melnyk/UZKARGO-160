function setPropertyRequired(attributeName, boolValue = true) {
  //обов"язкове
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.required = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyHidden(attributeName, boolValue = true) {
  //приховане
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.hidden = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyDisabled(attributeName, boolValue = true) {
  //недоступне
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.disabled = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setAttrValue(attributeCode, attributeValue) {
  var attribute = EdocsApi.getAttributeValue(attributeCode);
  attribute.value = attributeValue;
  EdocsApi.setAttributeValue(attribute);
}

//Скрипт 1. Автоматичне визначення email ініціатора рахунку та підрозділу
function onCreate() {
  EdocsApi.setAttributeValue({
    code: "Branch",
    value: EdocsApi.getOrgUnitDataByUnitID(
      EdocsApi.getEmployeeDataByEmployeeID(CurrentDocument.initiatorId).unitId,
      1
    ).unitId,
    text: null,
  });
}

function onSearchBranch(searchRequest) {
  searchRequest.filterCollection.push({
    attributeCode: "SubdivisionLevelDirect",
    value: "1",
  });
}

function onCardInitialize() {
  DefinitionAgreeableTask();
  EnterResultsTask();
  RegisterActTask();
}
//Скрипт 2. Зміна властивостей атрибутів та автоматичне визначення email ініціатора
function DefinitionAgreeableTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode(
    "DefinitionAgreeable" + EdocsApi.getAttributeValue("Sections").value
  )?.state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("SubjectAct");
      setPropertyRequired("Agreeable");
      setPropertyRequired("OrgRPEmail");
      setPropertyRequired("ContractorRPEmail");
      setPropertyHidden("SubjectAct", false);
      setPropertyHidden("Agreeable", false);
      setPropertyHidden("OrgRPEmail", false);
      setPropertyHidden("ContractorRPEmail", false);
      setPropertyDisabled("SubjectAct", false);
      setPropertyDisabled("Agreeable", false);
      setPropertyDisabled("OrgRPEmail", false);
      setPropertyDisabled("ContractorRPEmail", false);

      EdocsApi.setAttributeValue({
        code: "OrgRPEmail",
        value: EdocsApi.getEmployeeDataByEmployeeID(CurrentDocument.initiatorId)
          .email,
        text: null,
      });
      break;

    case "completed":
      setPropertyRequired("SubjectAct");
      setPropertyRequired("Agreeable");
      setPropertyRequired("OrgRPEmail");
      setPropertyRequired("ContractorRPEmail");
      setPropertyHidden("SubjectAct", false);
      setPropertyHidden("Agreeable", false);
      setPropertyHidden("OrgRPEmail", false);
      setPropertyHidden("ContractorRPEmail", false);
      setPropertyDisabled("SubjectAct");
      setPropertyDisabled("Agreeable");
      setPropertyDisabled("OrgRPEmail");
      setPropertyDisabled("ContractorRPEmail");

    default:
      setPropertyRequired("SubjectAct", false);
      setPropertyRequired("Agreeable", false);
      setPropertyRequired("OrgRPEmail", false);
      setPropertyRequired("ContractorRPEmail", false);
      setPropertyHidden("SubjectAct");
      setPropertyHidden("Agreeable");
      setPropertyHidden("OrgRPEmail");
      setPropertyHidden("ContractorRPEmail");
      setPropertyDisabled("SubjectAct", false);
      setPropertyDisabled("Agreeable", false);
      setPropertyDisabled("OrgRPEmail", false);
      setPropertyDisabled("ContractorRPEmail", false);
      break;
  }
}

function onTaskExecuteDefinitionAgreeable(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("SubjectAct").value)
      throw `Внесіть значення в поле "Предмет акту"`;
    if (!EdocsApi.getAttributeValue("Agreeable").value)
      throw `Внесіть значення в поле "погоджуючі"`;
    if (!EdocsApi.getAttributeValue("OrgRPEmail").value)
      throw `Внесіть значення в поле "email контактної особи Організації"`;
    if (!EdocsApi.getAttributeValue("ContractorRPEmail").value)
      throw `Внесіть значення в поле "email контактної особи Замовника"`;
  }
}

//Скрипт 3. Зміна властивостей атрибутів
function EnterResultsTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode(
    "EnterResults" + EdocsApi.getAttributeValue("Sections").value
  )?.state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("ActMeetingResult");
      setPropertyRequired("Number");
      setPropertyHidden("ActMeetingResult", false);
      setPropertyHidden("Number", false);
      setPropertyDisabled("ActMeetingResult", false);
      setPropertyDisabled("Number", false);
      break;

    case "completed":
      setPropertyRequired("ActMeetingResult");
      setPropertyRequired("Number");
      setPropertyHidden("ActMeetingResult", false);
      setPropertyHidden("Number", false);
      setPropertyDisabled("ActMeetingResult");
      setPropertyDisabled("Number");

    default:
      setPropertyRequired("ActMeetingResult", false);
      setPropertyRequired("Number", false);
      setPropertyHidden("ActMeetingResult");
      setPropertyHidden("Number");
      setPropertyDisabled("ActMeetingResult", false);
      setPropertyDisabled("Number", false);
      break;
  }
}

function onTaskExecuteEnterResults(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("ActMeetingResult").value)
      throw `Внесіть значення в поле "Результат розгляду акту засіданням"`;
    if (!EdocsApi.getAttributeValue("Number").value)
      throw `Внесіть значення в поле "Номер"`;
  }
}

//Скрипт 4. Зміна властивостей атрибутів
function RegisterActTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode(
    "RegisterAct" + EdocsApi.getAttributeValue("Sections").value
  )?.state;

  switch (stateTask) {
    case "assigned" || "inProgress" || "delegated":
      setPropertyRequired("RegDate");
      setPropertyRequired("RegNumber");
      setPropertyRequired("Registraion");
      setPropertyHidden("RegDate", false);
      setPropertyHidden("RegNumber", false);
      setPropertyHidden("Registraion", false);
      setPropertyDisabled("RegDate", false);
      setPropertyDisabled("RegNumber", false);
      setPropertyDisabled("Registraion", false);
      break;

    case "completed":
      setPropertyRequired("RegDate");
      setPropertyRequired("RegNumber");
      setPropertyRequired("Registraion");
      setPropertyHidden("RegDate", false);
      setPropertyHidden("RegNumber", false);
      setPropertyHidden("Registraion", false);
      setPropertyDisabled("RegDate");
      setPropertyDisabled("RegNumber");
      setPropertyDisabled("Registraion");

    default:
      setPropertyRequired("RegDate", false);
      setPropertyRequired("RegNumber", false);
      setPropertyRequired("Registraion", false);
      setPropertyHidden("RegDate");
      setPropertyHidden("RegNumber");
      setPropertyHidden("Registraion");
      setPropertyDisabled("RegDate", false);
      setPropertyDisabled("RegNumber", false);
      setPropertyDisabled("Registraion", false);
      break;
  }
}

function onTaskExecuteRegisterAct(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("RegDate").value)
      throw `Внесіть значення в поле "Реєстраційна дата"`;
    if (!EdocsApi.getAttributeValue("RegNumber").value)
      throw `Внесіть значення в поле "Реєстраційний номер"`;
    if (!EdocsApi.getAttributeValue("Registraion").value)
      throw `Внесіть значення в поле "Реєстрація"`;
  }
}

//Скрипт 5. Визначення ролі за розрізом
function setSections() {
  debugger;
  var Branch = EdocsApi.getAttributeValue("Branch");
  if (Branch.value) {
    var Sections = EdocsApi.getAttributeValue("Sections");
    var BranchData = EdocsApi.getOrgUnitDataByUnitID(Branch.value);
    if (Sections.value != BranchData.unitName) {
      Sections.value = BranchData.unitName;
      EdocsApi.setAttributeValue(Sections);
    }
  }
}

function onChangeBranch() {
  setSections();
}

//Скрипт 6. Передача наказу для ознайомлення  в зовнішню систему
// Відправлення на підпис в зовнішній сервіс eSign договору
//-------------------------------
function setDataForESIGN() {
  debugger;
  var registrationDate = EdocsApi.getAttributeValue("RegDate").value;
  var registrationNumber = EdocsApi.getAttributeValue("RegNumber").value;
  var caseType = EdocsApi.getAttributeValue("DocType").value;
  var caseKind = EdocsApi.getAttributeValue("DocKind").text;
  var name = "";
  if (caseKind) {
    name += caseKind;
  } else {
    name += caseType;
  }
  name +=
    " №" +
    (registrationNumber ? registrationNumber : CurrentDocument.id) +
    (!registrationDate
      ? ""
      : " від " + moment(registrationDate).format("DD.MM.YYYY"));
  doc = {
    DocName: name,
    extSysDocId: CurrentDocument.id,
    ExtSysDocVersion: CurrentDocument.version,
    docType: "Act",
    docDate: registrationDate,
    docNum: registrationNumber,
    File: "",
    parties: [
      {
        taskType: "ToSign",
        taskState: "Done",
        legalEntityCode: EdocsApi.getAttributeValue("OrgCode").value,
        contactPersonEmail: EdocsApi.getAttributeValue("OrgRPEmail").value,
        signatures: [],
      },
      {
        taskType: "ToRead",
        taskState: "NotAssigned",
        legalEntityCode: EdocsApi.getAttributeValue("ContractorCode").value,
        contactPersonEmail:
          EdocsApi.getAttributeValue("ContractorRPEmail").value,
        expectedSignatures: [],
      },
    ],
    additionalAttributes: [
      {
        code: "docDate",
        type: "dateTime",
        value: registrationDate,
      },
      {
        code: "docNum",
        type: "string",
        value: registrationNumber,
      },
    ],
    sendingSettings: {
      attachFiles: "fixed", //, можна також встановлювати 'firstOnly' - Лише файл із першої зафіксованої вкладки(Головний файл), або 'all' - всі файли, 'fixed' - усі зафіксовані
      attachSignatures: "signatureAndStamp", // -'signatureAndStamp'Типи “Підпис” або “Печатка”, можна також встановити 'all' - усі типи цифрових підписів
    },
  };
  EdocsApi.setAttributeValue({ code: "JSON", value: JSON.stringify(doc) });
}

function onTaskExecuteSendOutDoc(routeStage) {
  debugger;
  if (routeStage.executionResult == "rejected") {
    return;
  }
  setDataForESIGN();
  var idnumber = EdocsApi.getAttributeValue("DocId");
  var methodData = {
    extSysDocId: idnumber.value,
  };

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/importDoc", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}

function onTaskCommentedSendOutDoc(caseTaskComment) {
  debugger;
  var orgCode = EdocsApi.getAttributeValue("OrgCode").value;
  var orgShortName = EdocsApi.getAttributeValue("OrgShortName").value;
  if (!orgCode || !orgShortName) {
    return;
  }
  var idnumber = EdocsApi.getAttributeValue("DocId");
  var methodData = {
    extSysDocId: idnumber.value,
    eventType: "CommentAdded",
    comment: caseTaskComment.comment,
    partyCode: orgCode,
    userTitle: CurrentUser.name,
    partyName: orgShortName,
    occuredAt: new Date(),
  };

  caseTaskComment.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processEvent", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}
