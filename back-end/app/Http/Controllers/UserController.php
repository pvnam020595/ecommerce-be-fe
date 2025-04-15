<?php

namespace App\Http\Controllers;

use App\Repositories\User\UserInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //

    public function __construct() {}

    // public function index(Request $request): JsonResponse
    // {
    //     var_dump($this->userInterface->find('2222222'));

    //     return response()->json($this->userInterface->find('2222222'));
    // }
}
