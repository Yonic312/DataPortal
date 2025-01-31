
DataPortalApp = class DataPortalApp extends AApplication
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	onReady()
	{
		super.onReady();

		this.setMainContainer(new APage('main'))
		this.mainContainer.open('Source/MainView.lay')

	}

	unitTest(unitUrl)
	{
		this.onReady()

		super.unitTest(unitUrl)
	}

    
}

