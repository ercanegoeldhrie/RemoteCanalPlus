package com.remotecanalplus

import android.content.Context
import android.hardware.ConsumerIrManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class InfraredModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var irManager: ConsumerIrManager? = null

    init {
        // Récupération du service infrarouge natif d'Android
        irManager = reactContext.getSystemService(Context.CONSUMER_IR_SERVICE) as? ConsumerIrManager
    }

    override fun getName(): String {
        return "InfraredModule"
    }

    @ReactMethod
    fun hasIrEmitter(promise: Promise) {
        if (irManager != null && irManager!!.hasIrEmitter()) {
            promise.resolve(true)
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun transmit(frequency: Int, patternStr: String, promise: Promise) {
        try {
            val manager = irManager
            if (manager == null || !manager.hasIrEmitter()) {
                promise.reject("NO_IR", "Aucun émetteur infrarouge disponible sur cet appareil.")
                return
            }

            // Découpage et conversion de la chaîne "9000,4500,..." en tableau d'entiers
            val items = patternStr.split(",").map { it.trim().toInt() }.toIntArray()

            // Transmission physique via la puce du Redmi
            manager.transmit(frequency, items)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("IR_ERROR", e.message)
        }
    }
}