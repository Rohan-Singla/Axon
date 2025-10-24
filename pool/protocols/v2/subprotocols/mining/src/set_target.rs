use alloc::{fmt, vec::Vec};
use binary_sv2::{binary_codec_sv2, Deserialize, Serialize, U256 as BinaryU256};
use core::convert::TryInto;
use primitive_types::U256 as PrimitiveU256;

/// Message used by upstream to control the downstream submission rate by adjusting the difficulty
/// target on a specified channel.
///
/// All submits leading to hashes higher than the specified target are expected to be rejected by
/// the upstream.
///
/// [`SetTarget::maximum_target`] is valid until the next [`SetTarget`] message is sent and is
/// applicable for all jobs received on the channel in the future or already received with flag
/// `future_job=true`.
///
/// When this message is sent to a group channel, the maximum target is applicable to all channels
/// in the group.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SetTarget<'decoder> {
    /// Channel identifier.
    pub channel_id: u32,
    /// Maximum value of produced hash that will be accepted by a upstream to accept shares.
    pub maximum_target: BinaryU256<'decoder>,
}

impl fmt::Display for SetTarget<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Convert Inner (binary_sv2::U256<'_>) to primitive_types::U256 for arithmetic
        let bytes: [u8; 32] = self.maximum_target.as_ref().try_into().unwrap();
        let target = PrimitiveU256::from_big_endian(&bytes);

        let difficulty = PrimitiveU256::MAX / target;

        write!(
            f,
            "SetTarget(channel_id={}, maximum_target={}, difficulty={})",
            self.channel_id, self.maximum_target, difficulty
        )
    }
}
