<template>
    <div>
        <div class="tt"></div>
        <block v-if="ww">
            <view class="ff1" v-if="gt"> </view>
            <block v-if="gr">
                <block v-if="rr">
                    <div class="fe"></div>
                </block>
                <block>
                    <block>
                        <block>
                            <block> 
                                <div class="fe4"></div>
                            </block>
                        </block>
                    </block>
                </block>
                <block v-if="ee">
                    <div class="fes2" v-if="tt"></div>
                </block>
                <block v-else-if="fr">
                    <div class="fes3" ></div>
                </block>
                <block v-else id="rr">
                    <div class="fes4" ></div>
                </block>
                <div class="fe3"></div>
            </block>
            <view class="cf1" v-if="gt"> </view>
        </block>
        <block v-else>
            <view class="ff2"> </view>
            <view class="ww2" id="ww2"> </view>
        </block>
        <div id="fr"></div>
        
    </div>
</template>

<script></script>
<style lang="scss">
.tt + .cf1 {
    color: #000;
}
.fes3 ~ #fr {
    color: #000;
}
.fes3 + .fe3 {
    color: #000;
}
.fe4 + .fe3{
    color: #000;
}
.ww2 + #fr{
    color: #000;
}
.tt + #fr{
    color: #000;
}
</style>
