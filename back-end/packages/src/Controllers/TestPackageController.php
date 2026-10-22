<?php

namespace Laravel\Testpackage\Controllers;

use Illuminate\Routing\Controller;

class TestPackageController extends Controller
{
	public function index()
	{
		return view('testpackage::index');
	}
}