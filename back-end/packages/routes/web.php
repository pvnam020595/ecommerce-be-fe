<?php

use Illuminate\Support\Facades\Route;

use Laravel\Testpackage\Controllers\TestPackageController;

Route::resource('testpackage', TestPackageController::class);