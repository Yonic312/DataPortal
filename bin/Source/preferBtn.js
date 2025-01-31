
/*
* ADataMask 사용자 정의 파일
*/
if(!ADataMask.preferBtn) ADataMask.preferBtn = {};
ADataMask.preferBtn.settingBtn =
{
	title : "함수 설명",
	param : ["파라미터1 설명", "파라미터2 설명"], //마스크 등록 시 입력할 파라미터 정의
	func : function funcName(value, param, ele, dataObj)
	{
		return value;
	}
};
