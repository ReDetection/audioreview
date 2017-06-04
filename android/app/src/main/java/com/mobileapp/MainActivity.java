package com.mobileapp;

import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "mobileApp";
    }

    @Override
    public Intent getIntent() {
        Intent origIntent = super.getIntent();
        if (origIntent != null && Intent.ACTION_SEND.equals(origIntent.getAction())) {
            return new Intent(Intent.ACTION_VIEW, this.uriFromClipData(origIntent.getClipData()));
        }
        return origIntent;
    }

    private Uri uriFromClipData(ClipData clip) {
        if (clip != null && clip.getItemCount() > 0) {
            return clip.getItemAt(0).getUri();
        }
        return null;
    }

}
