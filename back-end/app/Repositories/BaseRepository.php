<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 *
 * @implements BaseInterface<TModel>
 */
abstract class BaseRepository implements BaseInterface
{
    /** @var TModel */
    protected Model $model;

    /**
     * @param  TModel  $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * @return Collection<int, TModel>
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $model = $this->find($id);
        if ($model) {
            return $model->update($data);
        }

        return false;
    }

    public function delete(int $id): bool
    {
        $model = $this->find($id);
        if ($model) {
            return $model->delete();
        }

        return false;
    }
}
