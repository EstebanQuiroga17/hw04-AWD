<?php

namespace Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Bank extends Model
{
    protected $table = 'Banks';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'name',
        'country',
        'clients',
        'owner',
        'phoneNumber',
        'dollarValue',
        'creationDate',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Uuid::uuid4()->toString();
            }
        });
    }

}
