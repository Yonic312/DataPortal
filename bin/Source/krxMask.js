
/*
* ADataMask 사용자 정의 파일
*/
if(!ADataMask.krxMask) ADataMask.krxMask = {};
ADataMask.krxMask.totalCount =
{
	title : "totalCount",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function totalCount(value, param, ele, dataObj)
	{
		if(!isNaN(value)) {
            value = Number(value).toLocaleString() + '페이지';
        }
		return value;
	}
};
