<?php

namespace Laravel\Testpackage\Providers;
use Illuminate\Support\ServiceProvider;
class TestPackageServiceProvider extends ServiceProvider
{
	public function boot()
	{
		$this->loadRoutesFrom(__DIR__.'/routes/web.php');
		$this->loadViewsFrom(__DIR__.'/views', 'testpackage');

		$this->publishes([
			__DIR__.'/views' => resource_path('views/vendor/testpackage'),
			__DIR__.'/config/testpackage.php' => config_path('testpackage.php'),
		]);
	}
}