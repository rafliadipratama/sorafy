package com.rafliadipratama.musiceuy.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rafliadipratama.musiceuy.R
import com.rafliadipratama.musiceuy.ui.theme.BrandGreen
import com.rafliadipratama.musiceuy.ui.theme.TextMuted

enum class NavigationTab(
    val titleResId: Int,
    val activeIconRes: Int,
    val inactiveIconRes: Int
) {
    HOME(
        R.string.nav_home,
        R.drawable.ic_iconsax_home_2_bold,
        R.drawable.ic_iconsax_home_2_linear
    ),
    SEARCH(
        R.string.nav_search,
        R.drawable.ic_iconsax_search_normal_bold,
        R.drawable.ic_iconsax_search_normal_linear
    ),
    LIBRARY(
        R.string.nav_library,
        R.drawable.ic_iconsax_music_library_2_bold,
        R.drawable.ic_iconsax_music_library_2_linear
    ),
    PLUGINS(
        R.string.nav_plugins,
        R.drawable.ic_iconsax_setting_2_bold,
        R.drawable.ic_iconsax_setting_2_linear
    )
}

@Composable
fun BottomNavBar(
    selectedTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit,
    modifier: Modifier = Modifier
) {
    val navShape = ContinuousCornerShape(
        topStart = 22.dp,
        topEnd = 22.dp,
        bottomStart = 0.dp,
        bottomEnd = 0.dp
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .liquidGlass(
                shape = navShape,
                backgroundColor = Color(0xF20B0E14)
            )
            .padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            NavigationTab.entries.forEach { tab ->
                val isSelected = tab == selectedTab
                val interactionSource = remember { MutableInteractionSource() }

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(ContinuousCornerShape(12.dp))
                        .pressBounce(interactionSource = interactionSource, pressedScale = 0.90f)
                        .clickable(
                            interactionSource = interactionSource,
                            indication = null,
                            onClick = { onTabSelected(tab) }
                        )
                        .padding(vertical = 4.dp)
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .padding(horizontal = 12.dp, vertical = 2.dp)
                            .then(
                                if (isSelected) {
                                    Modifier.background(
                                        Color(0x1400E599),
                                        ContinuousCornerShape(14.dp)
                                    )
                                } else {
                                    Modifier
                                }
                            )
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = if (isSelected) tab.activeIconRes else tab.inactiveIconRes),
                            contentDescription = stringResource(id = tab.titleResId),
                            tint = if (isSelected) BrandGreen else TextMuted,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = stringResource(id = tab.titleResId),
                        color = if (isSelected) BrandGreen else TextMuted,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium
                    )
                }
            }
        }
    }
}
